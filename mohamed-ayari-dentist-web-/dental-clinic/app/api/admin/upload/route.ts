import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { validateImageMagicBytes } from '@/lib/security-utils';
import { logAudit } from '@/lib/audit';
import { generalLimiter } from '@/lib/rate-limit';

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
  const limited = generalLimiter(req);
  if (limited) return limited;

  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slot = formData.get('slot') as string | null;

    if (!file) return badRequest('Aucun fichier fourni');

    // Validate declared MIME type against allowed list
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest('Type non autorisé (JPG, PNG ou WebP uniquement)');
    }

    if (file.size > MAX_SIZE) return badRequest('Fichier trop volumineux (max 5 Mo)');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate actual file contents against known magic bytes
    // Prevents MIME-type spoofing (e.g. a PHP script renamed to image.jpg)
    if (!validateImageMagicBytes(buffer, file.type)) {
      return badRequest(
        'Le fichier ne correspond pas au type déclaré. Seules les vraies images sont acceptées.'
      );
    }

    const publicDir = path.join(process.cwd(), 'public');

    // Fixed slots (hero / about images)
    if (slot && slot in FIXED_SLOTS) {
      const filename = FIXED_SLOTS[slot];
      const dest = path.join(publicDir, filename);

      // Security: ensure destination is strictly inside public/
      if (!dest.startsWith(publicDir + path.sep)) {
        return badRequest('Slot invalide');
      }

      await writeFile(dest, buffer);
      await logAudit(auth.sub, 'GALLERY_UPLOAD', req, `slot=${slot} size=${file.size}`);
      return ok({ url: `/${filename}` }, 'Image mise à jour avec succès');
    }

    // Gallery slot: save with unique name under /gallery/
    if (slot === 'gallery') {
      const galleryDir = path.join(publicDir, 'gallery');
      await mkdir(galleryDir, { recursive: true });

      // Use crypto-random name, not timestamp (predictable)
      const { randomBytes } = await import('crypto');
      const filename = `${randomBytes(16).toString('hex')}.${ext(file.type)}`;
      const dest = path.join(galleryDir, filename);

      // Security: ensure destination stays inside /gallery/
      if (!dest.startsWith(galleryDir + path.sep) && dest !== galleryDir) {
        return badRequest('Slot invalide');
      }

      await writeFile(dest, buffer);
      await logAudit(auth.sub, 'GALLERY_UPLOAD', req, `gallery size=${file.size}`);
      return ok({ url: `/gallery/${filename}` }, 'Image téléchargée avec succès');
    }

    return badRequest('Slot invalide');
  } catch {
    return serverError();
  }
}
