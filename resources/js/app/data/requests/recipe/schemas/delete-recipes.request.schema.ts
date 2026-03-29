import { DeleteRecipesRequestData } from '@/types/generated';
import z from 'zod';

export const deleteRecipesRequestSchema = z.object({
  ids: z.array(z.string()),
}) satisfies z.ZodType<DeleteRecipesRequestData>;
