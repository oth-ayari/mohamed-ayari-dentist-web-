import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export async function POST(req: NextRequest) {
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

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.admin.update({ where: { id: auth.sub }, data: { hashedPassword } });

    await prisma.refreshToken.deleteMany({ where: { adminId: auth.sub } });

    return ok(null, 'Mot de passe mis à jour avec succès');
  } catch {
    return serverError();
  }
}
