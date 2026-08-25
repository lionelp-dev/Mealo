import { MealTimeRequestData } from '@/types/generated';
import z from 'zod';

export const mealTimeRequestSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().trim().min(1, 'Le slug du moment de repas ne peut pas être vide'),
}) satisfies z.ZodType<MealTimeRequestData>;
