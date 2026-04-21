import { RecipeFormRequestData } from '@/types/generated';
import z from 'zod';

export const recipeFormRequestSchema = z.object({
  ingredients_search: z.string().optional(),
  tags_search: z.string().optional(),
  show_generate_recipe_with_ai_modal: z.boolean().optional(),
  generate_image_data: z
    .object({
      generate: z.boolean(),
      recipe_name: z.string(),
    })
    .nullable()
    .optional()
    .default(null),
}) satisfies z.ZodType<RecipeFormRequestData>;
