import { TagRequestData } from '@/types/generated';
import z from 'zod';

export const tagRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Le nom du tag ne doit pas être vide'),
}) satisfies z.ZodType<TagRequestData>;
