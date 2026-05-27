import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getClientIp } from '@/lib/security-utils';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_LOCKED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_VIA_RECOVERY'
  | 'PROFILE_UPDATE'
  | 'RECOVERY_CODES_GENERATED'
  | 'RECOVERY_CODE_USED'
  | 'APPOINTMENT_STATUS_UPDATED'
  | 'APPOINTMENT_DELETED'
  | 'GALLERY_UPLOAD'
  | 'GALLERY_DELETE'
  | 'TESTIMONIAL_APPROVED'
  | 'TESTIMONIAL_REJECTED'
  | 'TESTIMONIAL_DELETED'
  | 'MESSAGE_READ'
  | 'MESSAGE_DELETED';

/**
 * Write an immutable audit log entry.
 * Never throws — audit logging must never break the main request.
 */
export async function logAudit(
  adminId: string,
  action: AuditAction,
  req: NextRequest,
  details?: string
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        details: details ?? null,
        ipAddress: getClientIp(req),
        userAgent: (req.headers.get('user-agent') ?? '').slice(0, 500) || null,
      },
    });
  } catch {
    // Intentionally swallowed — audit logging must never disrupt the request
  }
}
