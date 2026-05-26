import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const FIXED_SLOTS: Record<string, string> = {
  'clinic-photo': 'clinic-photo.png',
  'doctor-photo': 'doctor-photo.png',
};

function ext(mime: string) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slot = formData.get('slot') as string | null;

    if (!file) return badRequest('Aucun fichier fourni');
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest('Type non autorisé (JPG, PNG ou WebP uniquement)');
    }
    if (file.size > MAX_SIZE) return badRequest('Fichier trop volumineux (max 5 Mo)');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicDir = path.join(process.cwd(), 'public');

    // Fixed slots (hero / about images)
    if (slot && slot in FIXED_SLOTS) {
      const filename = FIXED_SLOTS[slot];
      await writeFile(path.join(publicDir, filename), buffer);
      return ok({ url: `/${filename}` }, 'Image mise à jour avec succès');
    }

    // Gallery slot: save with unique name under /gallery/
    if (slot === 'gallery') {
      const galleryDir = path.join(publicDir, 'gallery');
      await mkdir(galleryDir, { recursive: true });
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext(file.type)}`;
      await writeFile(path.join(galleryDir, filename), buffer);
      return ok({ url: `/gallery/${filename}` }, 'Image téléchargée avec succès');
    }

    return badRequest('Slot invalide');
  } catch {
    return serverError();
  }
}
