import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Known magic byte signatures for allowed image types
const IMAGE_SIGNATURES: Record<string, { bytes: number[]; offset?: number }[]> = {
  'image/jpeg': [{ bytes: [0xff, 0xd8, 0xff] }],
  'image/jpg': [{ bytes: [0xff, 0xd8, 0xff] }],
  'image/png': [{ bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  'image/webp': [
    { bytes: [0x52, 0x49, 0x46, 0x46] },
    // WebP also needs "WEBP" at offset 8
  ],
};

/**
 * Validate image file contents against known magic bytes.
 * Prevents MIME-type spoofing (e.g. .php renamed to .jpg).
 */
export function validateImageMagicBytes(buffer: Buffer, claimedMime: string): boolean {
  const signatures = IMAGE_SIGNATURES[claimedMime];
  if (!signatures) return false;

  const primary = signatures[0];
  if (buffer.length < primary.bytes.length) return false;

  const matches = primary.bytes.every((byte, i) => buffer[i] === byte);
  if (!matches) return false;

  // WebP extra validation: bytes 8-11 must be "WEBP"
  if (claimedMime === 'image/webp') {
    if (buffer.length < 12) return false;
    const webp = [0x57, 0x45, 0x42, 0x50];
    if (!webp.every((byte, i) => buffer[8 + i] === byte)) return false;
  }

  return true;
}

/**
 * Escape characters that have special meaning in HTML.
 * Use before inserting user data into HTML email templates.
 */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Extract the real client IP from standard proxy headers.
 * Validates format to prevent header-injection attacks.
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const candidate = xff.split(',')[0].trim();
    // Accept IPv4 and IPv6 only
    if (/^[\d.]{7,15}$/.test(candidate) || /^[0-9a-f:]{3,39}$/i.test(candidate)) {
      return candidate;
    }
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp && /^[\d.]{7,15}$/.test(realIp)) return realIp;
  return '127.0.0.1';
}

/**
 * Generate a single recovery code in format XXXX-XXXX.
 * Uses a 31-character unambiguous alphabet (no 0/O/I/1 confusion).
 */
export function generateRecoveryCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** Generate N recovery codes. */
export function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => generateRecoveryCode());
}

/**
 * Normalise a recovery code entered by the user:
 * strip dashes, whitespace, and uppercase.
 */
export function normaliseRecoveryCode(raw: string): string {
  return raw.replace(/[-\s]/g, '').toUpperCase().trim();
}

/** Constant-time string comparison to prevent timing attacks. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
}
