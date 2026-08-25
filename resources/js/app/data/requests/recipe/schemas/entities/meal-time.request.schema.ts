import { MealTimeRequestData } from '@/types/generated';
import z from 'zod';

export const mealTimeRequestSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1, 'Le nom du moment de repas ne peut pas être vide'),
}) satisfies z.ZodType<MealTimeRequestData>;
