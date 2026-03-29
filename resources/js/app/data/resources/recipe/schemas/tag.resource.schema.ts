import { TagResourceData } from '@/types/generated';
import z from 'zod';

export const tagResourceSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
}) satisfies z.ZodType<TagResourceData>;
