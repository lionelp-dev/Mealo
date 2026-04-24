import { RecipeAIGenerationRequestData } from '@/types/generated';
import z from 'zod';

export const recipeAIGenerationRequestSchema = z.object({
  prompt: z.string().min(5).max(255),
  image_generation: z.boolean(),
}) satisfies z.ZodType<RecipeAIGenerationRequestData>;
