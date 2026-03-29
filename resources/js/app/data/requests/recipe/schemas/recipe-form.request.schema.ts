import { RecipeFormRequestData } from '@/types/generated';
import z from 'zod';

export const recipeFormRequestSchema = z.object({
  ingredients_search: z.string().optional(),
  tags_search: z.string().optional(),
  show_generate_recipe_with_ai_modal: z.boolean().optional(),
}) satisfies z.ZodType<RecipeFormRequestData>;
