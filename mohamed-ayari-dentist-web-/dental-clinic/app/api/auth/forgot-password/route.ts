/**
 * Forgot Password via Recovery Code
 *
 * POST /api/auth/forgot-password
 *
 * Verifies email + recovery code + new password in one step.
 * On success: resets password, invalidates all sessions, marks the code as used.
 *
 * Rate-limited to 3 attempts per hour per IP to prevent brute-force.
 */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { serverError } from '@/lib/api-response';
import { forgotPasswordLimiter } from '@/lib/rate-limit';
import { normaliseRecoveryCode } from '@/lib/security-utils';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase().trim()),

  recoveryCode: z.string().min(1).max(20),

  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

/** Generic error used for ALL failure paths to prevent user enumeration. */
const GENERIC_ERROR = 'Code de récupération invalide ou expiré.';

export async function POST(req: NextRequest) {
  const limited = forgotPasswordLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: GENERIC_ERROR }, { status: 400 });
    }

    const { email, recoveryCode, newPassword } = parsed.data;
    const normalised = normaliseRecoveryCode(recoveryCode);
    if (!normalised || normalised.length < 8) {
      return NextResponse.json({ success: false, error: GENERIC_ERROR }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
      include: {
        recoveryCodes: {
          where: { usedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Always run at least one bcrypt.compare to prevent timing-based user enumeration
    const dummyHash = '$2a$10$dummyhashplaceholderforunknownuserABCDEFGHIJKLMNOPQRSTUV';

    let matchedCode: { id: string } | null = null;

    if (!admin || admin.recoveryCodes.length === 0) {
      await bcrypt.compare(normalised, dummyHash);
      return NextResponse.json({ success: false, error: GENERIC_ERROR }, { status: 401 });
    }

    // Check each unused code — stop at the first match
    for (const rc of admin.recoveryCodes) {
      const match = await bcrypt.compare(normalised, rc.codeHash);
      if (match) {
        matchedCode = rc;
        break;
      }
    }

    if (!matchedCode) {
      return NextResponse.json({ success: false, error: GENERIC_ERROR }, { status: 401 });
    }

    // Prevent reusing the same password
    const isSame = await bcrypt.compare(newPassword, admin.hashedPassword);
    if (isSame) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le nouveau mot de passe doit être différent de l\'ancien.',
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      // Update password
      prisma.admin.update({
        where: { id: admin.id },
        data: { hashedPassword, failedAttempts: 0, lockedUntil: null },
      }),
      // Mark code as used (not deleted — keep for audit trail)
      prisma.recoveryCode.update({
        where: { id: matchedCode.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate all active sessions
      prisma.refreshToken.deleteMany({ where: { adminId: admin.id } }),
    ]);

    // Audit log (no req auth context available here, so log inline)
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'PASSWORD_RESET_VIA_RECOVERY',
        ipAddress:
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          req.headers.get('x-real-ip') ??
          '127.0.0.1',
        userAgent: (req.headers.get('user-agent') ?? '').slice(0, 500) || null,
      },
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        data: null,
        message:
          'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
      },
      { status: 200 }
    );
  } catch {
    return serverError();
  }
}
