/**
 * Recovery Codes API
 *
 * GET  /api/admin/recovery-codes  — Return status: how many unused codes remain
 * POST /api/admin/recovery-codes  — Generate a fresh set of 8 codes (requires current password)
 *
 * Recovery codes are the fallback password-reset mechanism when no email inbox
 * is available. They are shown exactly once; the admin must print/save them.
 */
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { adminSensitiveLimiter } from '@/lib/rate-limit';
import { generateRecoveryCodes } from '@/lib/security-utils';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

/** GET — return remaining unused code count. Never returns the codes themselves. */
export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const count = await prisma.recoveryCode.count({
      where: { adminId: auth.sub, usedAt: null },
    });
    return ok({ unusedCount: count, hasBackup: count > 0 });
  } catch {
    return serverError();
  }
}

const generateSchema = z.object({
  currentPassword: z.string().min(1),
});

/** POST — generate a new set of 8 recovery codes. Old codes are invalidated. */
export async function POST(req: NextRequest) {
  const limited = adminSensitiveLimiter(req);
  if (limited) return limited;

  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Mot de passe actuel requis');
    }

    const admin = await prisma.admin.findUnique({ where: { id: auth.sub } });
    if (!admin) return unauthorized('Compte introuvable');

    // Require current password to regenerate codes (prevents a stolen session from
    // silently replacing the backup)
    const isValid = await bcrypt.compare(parsed.data.currentPassword, admin.hashedPassword);
    if (!isValid) return badRequest('Mot de passe actuel incorrect');

    const plainCodes = generateRecoveryCodes(8);

    // Hash all codes in parallel (cost 10 — fast enough in batch, safe enough at rest)
    const hashes = await Promise.all(plainCodes.map((c) => bcrypt.hash(c, 10)));

    // Replace all existing codes in a single transaction
    await prisma.$transaction([
      prisma.recoveryCode.deleteMany({ where: { adminId: auth.sub } }),
      prisma.recoveryCode.createMany({
        data: hashes.map((codeHash) => ({ adminId: auth.sub, codeHash })),
      }),
    ]);

    await logAudit(auth.sub, 'RECOVERY_CODES_GENERATED', req);

    // Return plain codes ONCE — they are never stored in plain text and cannot be
    // retrieved again after this response.
    return ok(
      { codes: plainCodes },
      'Codes de récupération générés. Sauvegardez-les maintenant — ils ne seront plus affichés.'
    );
  } catch {
    return serverError();
  }
}
