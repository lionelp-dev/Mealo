import { IngredientResourceData } from '@/types/generated';
import z from 'zod';

export const ingredientResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
}) satisfies z.ZodType<IngredientResourceData>;
