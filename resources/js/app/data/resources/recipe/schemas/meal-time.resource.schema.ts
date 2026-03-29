import { MealTimeResourceData } from '@/types/generated';
import z from 'zod';

export const mealTimeResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
}) satisfies z.ZodType<MealTimeResourceData>;
