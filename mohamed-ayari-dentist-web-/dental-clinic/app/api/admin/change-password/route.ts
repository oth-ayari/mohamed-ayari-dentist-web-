import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { adminSensitiveLimiter } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[a-z]/, 'Doit contenir une minuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Doit contenir un caractère spécial'),
});

export async function POST(req: NextRequest) {
  const limited = adminSensitiveLimiter(req);
  if (limited) return limited;

  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Données invalides', parsed.error.flatten().fieldErrors);
    }

    const { currentPassword, newPassword } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { id: auth.sub } });
    if (!admin) return unauthorized('Compte introuvable');

    const isValid = await bcrypt.compare(currentPassword, admin.hashedPassword);
    if (!isValid) return badRequest('Mot de passe actuel incorrect');

    // Prevent reusing the same password
    const isSame = await bcrypt.compare(newPassword, admin.hashedPassword);
    if (isSame) {
      return badRequest('Le nouveau mot de passe doit être différent de l\'actuel');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.admin.update({ where: { id: auth.sub }, data: { hashedPassword } }),
      // Invalidate all existing sessions to force re-login everywhere
      prisma.refreshToken.deleteMany({ where: { adminId: auth.sub } }),
    ]);

    await logAudit(auth.sub, 'PASSWORD_CHANGE', req);

    return ok(null, 'Mot de passe mis à jour avec succès. Veuillez vous reconnecter.');
  } catch {
    return serverError();
  }
}
