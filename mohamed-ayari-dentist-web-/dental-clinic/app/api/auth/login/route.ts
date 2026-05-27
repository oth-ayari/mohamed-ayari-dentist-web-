import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  signAccessToken,
  signRefreshToken,
  REFRESH_TOKEN_EXPIRY_MS,
} from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { authLimiter } from '@/lib/rate-limit';
import { loginSchema } from '@/validators/auth';
import { getClientIp } from '@/lib/security-utils';

// Account lockout policy
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const limited = authLimiter(req);
  if (limited) return limited;

  const ip = getClientIp(req);
  const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 500);

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Email ou mot de passe invalide');
    }

    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Constant-time comparison prevents user enumeration via timing
    const dummyHash = '$2a$12$abcdefghijklmnopqrstuuABC123DEFGHIJKLMNOPQRSTUVWXYZabc';
    const isValid = admin
      ? await bcrypt.compare(password, admin.hashedPassword)
      : await bcrypt.compare(password, dummyHash);

    // Check account lockout BEFORE reporting invalid credentials
    if (admin && admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 60000
      );
      await logAttempt(email, ip, userAgent, false);
      return NextResponse.json(
        {
          success: false,
          error: `Compte temporairement verrouillé. Réessayez dans ${minutesLeft} minute(s).`,
        },
        { status: 423 }
      );
    }

    if (!admin || !isValid) {
      // Increment failed attempts and possibly lock the account
      if (admin) {
        const newCount = admin.failedAttempts + 1;
        const shouldLock = newCount >= MAX_FAILED_ATTEMPTS;
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedAttempts: newCount,
            lockedUntil: shouldLock
              ? new Date(Date.now() + LOCKOUT_DURATION_MS)
              : undefined,
          },
        });
      }

      await logAttempt(email, ip, userAgent, false);
      return unauthorized('Email ou mot de passe incorrect');
    }

    // Successful login — reset failure counters, update last login info
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    await logAttempt(email, ip, userAgent, true);

    const tokenPayload = { sub: admin.id, email: admin.email, role: admin.role };
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload),
    ]);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        adminId: admin.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json(
      {
        success: true,
        data: {
          accessToken,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
        message: 'Connexion réussie',
      },
      { status: 200 }
    );

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 900,
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: Math.floor(REFRESH_TOKEN_EXPIRY_MS / 1000),
      path: '/api/auth',
    });

    return response;
  } catch {
    return serverError();
  }
}

async function logAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean
): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: { email, ipAddress, userAgent: userAgent || null, success },
    });
  } catch {
    // Logging must not block the login response
  }
}
