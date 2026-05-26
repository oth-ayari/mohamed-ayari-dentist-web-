import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

const PROTECTED_API_PATHS = [
  '/api/appointments',
  '/api/contact',
  '/api/analytics',
  '/api/admin',
];

const PUBLIC_POST_PATHS = [
  '/api/appointments',
  '/api/contact',
  '/api/admin/testimonials',
  '/api/visitors',
];

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Admin page protection
  if (pathname.startsWith('/admin')) {
    return handleAdminPage(req, pathname);
  }

  const isProtectedPath = PROTECTED_API_PATHS.some((p) => pathname.startsWith(p));
  const isPublicPost = PUBLIC_POST_PATHS.some((p) => pathname === p) && method === 'POST';
  const isPublicGet =
    pathname === '/api/admin/testimonials' && method === 'GET';

  if (isProtectedPath && !isPublicPost && !isPublicGet) {
    const token =
      req.cookies.get('access_token')?.value ||
      req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return addSecurityHeaders(
        NextResponse.json({ success: false, error: 'Token invalide ou expiré' }, { status: 401 })
      );
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-id', payload.sub);
    requestHeaders.set('x-admin-email', payload.email);
    requestHeaders.set('x-admin-role', payload.role);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Admin page SSR protection: redirect to /admin/login if not authenticated
async function handleAdminPage(req: NextRequest, pathname: string) {
  if (pathname === '/admin/login' || pathname === '/admin') {
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
