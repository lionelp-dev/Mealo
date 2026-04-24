import { RecipeDestroyRequestData } from '@/types/generated';
import z from 'zod';

export const recipesDestroyRequestSchema = z.object({
  ids: z.array(z.string()),
}) satisfies z.ZodType<RecipeDestroyRequestData>;
