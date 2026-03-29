import { StepRequestData } from '@/types/generated';
import z from 'zod';

export const stepRequestSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(1, "La description de l'étape ne peut pas être vide"),
  order: z.number().min(0, "L'ordre doit être supérieur ou égal à 0"),
}) satisfies z.ZodType<StepRequestData>;
