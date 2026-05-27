import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store. Acceptable for single-instance deployments.
// For multi-instance (horizontal scaling), replace with a Redis-backed store.
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  /** Optional key override — defaults to IP + pathname */
  keyBy?: (req: NextRequest) => string;
}

export function rateLimit(config: RateLimitConfig) {
  return function checkRateLimit(req: NextRequest): NextResponse | null {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const key = config.keyBy
      ? config.keyBy(req)
      : `${ip}:${req.nextUrl.pathname}`;

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + config.windowMs });
      return null;
    }

    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(entry.resetAt),
          },
        }
      );
    }

    entry.count++;
    return null;
  };
}

// Public-facing form submissions
export const appointmentLimiter = rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 5 });
export const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 3 });
export const testimonialLimiter = rateLimit({ windowMs: 24 * 60 * 60 * 1000, maxRequests: 3 });

// Authentication — strict to block brute-force
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 8 });

// Sensitive admin operations (password change, recovery code generation)
export const adminSensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 });

// Password reset via recovery code — very strict
export const forgotPasswordLimiter = rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 3 });

// General API reads/writes (authenticated admin actions)
export const generalLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 60 });
