import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

function loadSecret(envVar: string): Uint8Array {
  const value = process.env[envVar];

  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      // Hard crash in production — missing secret is a fatal misconfiguration
      throw new Error(`FATAL SECURITY ERROR: ${envVar} is not set. Refusing to start.`);
    }
    // Development-only fallback — clearly labeled, long enough to be valid
    console.warn(
      `\x1b[33m⚠  WARNING: ${envVar} is not set. Using an insecure dev-only fallback.\n` +
        `   Set ${envVar} in .env.local before deploying to production.\x1b[0m`
    );
    return new TextEncoder().encode(
      `dev-only-${envVar.toLowerCase()}-fallback-NEVER-use-in-production-pad`
    );
  }

  if (value.length < 32) {
    throw new Error(
      `FATAL SECURITY ERROR: ${envVar} is too short (${value.length} chars). Minimum 32 characters required.`
    );
  }

  return new TextEncoder().encode(value);
}

const ACCESS_TOKEN_SECRET = loadSecret('JWT_SECRET');
const REFRESH_TOKEN_SECRET = loadSecret('JWT_REFRESH_SECRET');

export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function signAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function signRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return verifyAccessToken(token);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (token) {
    return verifyAccessToken(token);
  }

  return null;
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): Response {
  const isProduction = process.env.NODE_ENV === 'production';
  const headers = new Headers(res.headers);
  headers.append(
    'Set-Cookie',
    `access_token=${accessToken}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=900`
  );
  headers.append(
    'Set-Cookie',
    `refresh_token=${refreshToken}; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict; Path=/api/auth; Max-Age=${REFRESH_TOKEN_EXPIRY_MS / 1000}`
  );
  return new Response(res.body, { status: res.status, headers });
}

export function clearAuthCookies(): Record<string, string> {
  return {
    'Set-Cookie': [
      'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
      'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=0',
    ].join(', '),
  };
}
