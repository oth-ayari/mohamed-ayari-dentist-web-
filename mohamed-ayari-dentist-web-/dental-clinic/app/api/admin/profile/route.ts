import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: auth.sub },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!admin) return unauthorized('Compte introuvable');
    return ok(admin);
  } catch {
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Données invalides', parsed.error.flatten().fieldErrors);
    }

    const { name, email } = parsed.data;

    if (email) {
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing && existing.id !== auth.sub) {
        return badRequest('Cet email est déjà utilisé');
      }
    }

    const updated = await prisma.admin.update({
      where: { id: auth.sub },
      data: { ...(name && { name }), ...(email && { email }) },
      select: { id: true, name: true, email: true, role: true },
    });

    return ok(updated, 'Profil mis à jour avec succès');
  } catch {
    return serverError();
  }
}
