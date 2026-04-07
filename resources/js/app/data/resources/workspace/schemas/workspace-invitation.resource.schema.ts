import { WorkspaceInvitationResourceData } from '@/types/generated';
import z from 'zod';

export const workspaceInvitationResourceSchema = z.object({
  id: z.number(),
  workspace_id: z.number(),
  workspace_name: z.string().nullable(),
  workspace_users_count: z.number().nullable(),
  email: z.string(),
  role: z.string(),
  token: z.string(),
  expires_at: z.string(),
  invited_by: z.object({
    name: z.string(),
  }),
}) satisfies z.ZodType<WorkspaceInvitationResourceData>;
