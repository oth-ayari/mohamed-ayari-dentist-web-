import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

const PROTECTED_API_PATHS = [
  '/api/appointments',
  '/api/contact',
  '/api/analytics',
  '/api/admin',
];

// Paths that accept unauthenticated POST/GET requests (public forms)
const PUBLIC_POST_PATHS = [
  '/api/appointments',
  '/api/contact',
  '/api/visitors',
  '/api/auth/forgot-password',
];

const PUBLIC_GET_PATHS = ['/api/admin/testimonials'];

// POST to testimonials is public (patients submit reviews; rate-limited separately)
const PUBLIC_TESTIMONIAL_POST = '/api/admin/testimonials';

function getSecurityHeaders(nonce?: string): Record<string, string> {
  // Content-Security-Policy
  // 'unsafe-inline' for scripts/styles is required by Next.js SSR/hydration.
  // For stricter security, generate per-request nonces and replace 'unsafe-inline'.
  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' 'unsafe-eval'`
    : `'self' 'unsafe-inline' 'unsafe-eval'`;

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `media-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');

  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    // max-age=2 years + includeSubDomains + preload
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  };
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(getSecurityHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}

/** Resolve the allowed CORS origin for this request. Never returns wildcard '*'. */
function resolveAllowedOrigin(req: NextRequest): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const origin = req.headers.get('Origin');

  if (!origin) return appUrl ?? 'null';

  // Exact match against configured URL
  if (appUrl && origin === appUrl) return origin;

  // In development, allow localhost variants
  if (process.env.NODE_ENV !== 'production') {
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return origin;
    if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return origin;
  }

  return 'null';
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': resolveAllowedOrigin(req),
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
        ...getSecurityHeaders(),
      },
    });
  }

  // Admin page SSR protection
  if (pathname.startsWith('/admin')) {
    return handleAdminPage(req, pathname);
  }

  const isProtectedPath = PROTECTED_API_PATHS.some((p) => pathname.startsWith(p));
  const isPublicPost =
    (PUBLIC_POST_PATHS.some((p) => pathname === p) ||
      (pathname === PUBLIC_TESTIMONIAL_POST)) &&
    method === 'POST';
  const isPublicGet = PUBLIC_GET_PATHS.some((p) => pathname === p) && method === 'GET';

  if (isProtectedPath && !isPublicPost && !isPublicGet) {
    const token =
      req.cookies.get('access_token')?.value ||
      req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const res = NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
      return addSecurityHeaders(res);
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      const res = NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 401 }
      );
      return addSecurityHeaders(res);
    }

    // Propagate verified claims as trusted request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-id', payload.sub);
    requestHeaders.set('x-admin-email', payload.email);
    requestHeaders.set('x-admin-role', payload.role);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
  return addSecurityHeaders(response);
}

// Admin page SSR protection: redirect to /admin/login if not authenticated
async function handleAdminPage(req: NextRequest, pathname: string) {
  // Login and forgot-password pages are always accessible
  if (
    pathname === '/admin/login' ||
    pathname === '/admin' ||
    pathname === '/admin/forgot-password'
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/admin'],
};
