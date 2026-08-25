import { RecipeIngredientResourceData } from '@/types/generated';
import z from 'zod';

export const recipeIngredientResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  category_id: z.number(),
}) satisfies z.ZodType<RecipeIngredientResourceData>;
