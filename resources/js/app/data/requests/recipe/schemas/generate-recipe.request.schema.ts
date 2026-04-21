import { GenerateRecipeRequestData } from '@/types/generated';
import z from 'zod';

export const generateRecipeRequestSchema = z.object({
  prompt: z.string().min(5).max(255),
  generate_image_data: z
    .object({
      generate: z.boolean(),
      recipe_name: z.string().optional(),
    })
    .nullable()
    .optional()
    .default(null),
}) satisfies z.ZodType<GenerateRecipeRequestData>;
