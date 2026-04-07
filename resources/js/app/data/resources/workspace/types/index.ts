import { workspaceInvitationResourceSchema } from '../schemas/workspace-invitation.resource.schema';
import { workspaceMemberResourceSchema } from '../schemas/workspace-member.resource.schema';
import { workspaceResourceSchema } from '../schemas/workspace.resource.schema';
import z from 'zod';

export type WorkspaceResource = z.infer<typeof workspaceResourceSchema>;
export type WorkspaceMemberResource = z.infer<
  typeof workspaceMemberResourceSchema
>;
export type WorkspaceInvitationResource = z.infer<
  typeof workspaceInvitationResourceSchema
>;
