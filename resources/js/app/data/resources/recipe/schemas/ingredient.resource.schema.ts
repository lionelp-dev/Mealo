import { IngredientResourceData } from '@/types/generated';
import z from 'zod';

export const ingredientResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category_id: z.number(),
}) satisfies z.ZodType<IngredientResourceData>;
