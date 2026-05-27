import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const reviewSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100)
    .transform((v) => v.trim()),
  rating: z
    .number()
    .int()
    .min(1, 'La note minimale est 1')
    .max(5, 'La note maximale est 5'),
  review: z
    .string()
    .min(10, 'L\'avis doit contenir au moins 10 caractères')
    .max(1000, 'L\'avis ne peut pas dépasser 1000 caractères')
    .transform((v) => v.trim()),
  service: z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((v) => v || null),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = reviewSchema.parse(body);

    await prisma.testimonial.create({
      data: {
        patientName: data.patientName,
        rating: data.rating,
        review: data.review,
        service: data.service ?? undefined,
        approved: false,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Avis reçu, en attente de validation.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[POST /api/reviews]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        patientName: true,
        rating: true,
        review: true,
        service: true,
        createdAt: true,
      },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('[GET /api/reviews]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
