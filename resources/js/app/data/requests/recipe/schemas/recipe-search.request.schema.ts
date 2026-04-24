import { RecipeSearchRequestData } from '@/types/generated';
import z from 'zod';

export const recipeSearchRequestSchema = z.object({
  ingredients_search: z.string().optional(),
  tags_search: z.string().optional(),
}) satisfies z.ZodType<RecipeSearchRequestData>;
