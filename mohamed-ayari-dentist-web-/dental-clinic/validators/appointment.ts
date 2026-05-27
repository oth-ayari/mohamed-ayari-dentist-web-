import { z } from 'zod';

const VALID_SERVICES = [
  'Orthodontie',
  'Implantologie',
  'Blanchiment dentaire',
  'Soins dentaires',
  'Détartrage et nettoyage',
  'Prothèses dentaires',
  'Chirurgie buccale',
  'Consultation générale',
] as const;

const VALID_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
];

export const createAppointmentSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides')
    .transform((v) => v.trim()),

  email: z
    .string()
    .email('Adresse email invalide')
    .max(255)
    .transform((v) => v.toLowerCase().trim()),

  phone: z
    .string()
    .min(6, 'Numéro trop court')
    .regex(/^\+?[\d\s\-().]{6,20}$/, 'Numéro de téléphone invalide')
    .transform((v) => v.trim()),

  selectedService: z
    .string()
    .min(1, 'Veuillez sélectionner un service')
    .max(100),

  appointmentDate: z
    .string()
    .refine((d) => {
      const date = new Date(d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today;
    }, 'La date doit être aujourd\'hui ou dans le futur')
    .transform((d) => new Date(d)),

  appointmentTime: z
    .string()
    .refine((t) => VALID_TIMES.includes(t), 'Créneau horaire invalide'),

  message: z
    .string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : null)),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
