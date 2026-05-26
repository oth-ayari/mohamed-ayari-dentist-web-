import { z } from 'zod';

export const createGalleryImageSchema = z.object({
  imageUrl: z.string().min(1).refine(
    v => v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://'),
    'URL invalide'
  ),
  thumbnailUrl: z.string().url().optional().nullable(),
  category: z
    .string()
    .min(1, 'La catégorie est requise')
    .max(50)
    .transform((v) => v.trim()),
  title: z.string().max(200).optional().nullable().transform((v) => v?.trim() || null),
  altText: z.string().max(200).optional().nullable().transform((v) => v?.trim() || null),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export const createTestimonialSchema = z.object({
  patientName: z.string().min(2).max(100).transform((v) => v.trim()),
  rating: z.number().int().min(1).max(5),
  review: z.string().min(10).max(1000).transform((v) => v.trim()),
  service: z.string().max(100).optional().nullable(),
});

export const updateTestimonialSchema = z.object({
  approved: z.boolean().optional(),
  review: z.string().min(10).max(1000).optional().transform((v) => v?.trim()),
  rating: z.number().int().min(1).max(5).optional(),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
