import { z } from 'zod';

export const createContactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides')
    .transform((v) => v.trim()),

  email: z
    .string()
    .email('Adresse email invalide')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),

  phone: z
    .preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z
        .string()
        .regex(/^\+?[\d\s\-().]{6,20}$/, 'Numéro invalide')
        .optional()
        .nullable()
    )
    .transform((v) => (v ? String(v).trim() : null)),

  subject: z
    .string()
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200)
    .transform((v) => v.trim()),

  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .transform((v) => v.trim()),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
