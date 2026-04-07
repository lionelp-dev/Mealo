import { WorkspaceMemberResourceData } from '@/types/generated';
import z from 'zod';

export const workspaceMemberResourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  joined_at: z.string(),
}) satisfies z.ZodType<WorkspaceMemberResourceData>;
