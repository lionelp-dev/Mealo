import { IngredientCategoryResourceData } from '@/types/generated';
import z from 'zod';

export const ingredientCategoryResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
}) satisfies z.ZodType<IngredientCategoryResourceData>;
