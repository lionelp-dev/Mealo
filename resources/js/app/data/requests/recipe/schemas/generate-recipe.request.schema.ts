import { GenerateRecipeRequestData } from '@/types/generated';
import z from 'zod';

export const generateRecipeRequestSchema = z.object({
  prompt: z.string().min(5).max(255),
}) satisfies z.ZodType<GenerateRecipeRequestData>;
