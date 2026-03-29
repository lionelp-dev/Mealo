import { StepResourceData } from '@/types/generated';
import z from 'zod';

export const stepResourceSchema = z.object({
  id: z.string(),
  description: z.string(),
  order: z.number(),
}) satisfies z.ZodType<StepResourceData>;
