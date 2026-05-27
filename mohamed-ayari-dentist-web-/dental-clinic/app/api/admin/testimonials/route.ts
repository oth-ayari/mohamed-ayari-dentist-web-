import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { generalLimiter, testimonialLimiter } from '@/lib/rate-limit';
import { createTestimonialSchema } from '@/validators/gallery';

export async function GET(req: NextRequest) {
  const limited = generalLimiter(req);
  if (limited) return limited;

  try {
    const { searchParams } = req.nextUrl;
    const auth = await getAuthFromRequest(req);
    const approvedOnly = !auth;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    const where: Record<string, unknown> = {};
    if (approvedOnly) where.approved = true;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return ok(testimonials, undefined, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  // Stricter limiter for public review submissions (3 per day per IP)
  const limited = testimonialLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Données invalides', parsed.error.flatten().fieldErrors);
    }

    const testimonial = await prisma.testimonial.create({
      data: { ...parsed.data, approved: false },
    });

    return created(
      { id: testimonial.id },
      'Votre avis a été soumis et sera publié après modération.'
    );
  } catch {
    return serverError();
  }
}
