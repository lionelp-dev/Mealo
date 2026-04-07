import { workspaceInvitationResourceSchema } from './workspace-invitation.resource.schema';
import { workspaceMemberResourceSchema } from './workspace-member.resource.schema';
import { WorkspaceResourceData } from '@/types/generated';
import z from 'zod';

export const workspaceResourceSchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  name: z.string(),
  is_default: z.boolean(),
  is_personal: z.boolean(),
  users_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  members: z.array(workspaceMemberResourceSchema),
  pending_invitations: z.array(workspaceInvitationResourceSchema),
}) satisfies z.ZodType<WorkspaceResourceData>;
