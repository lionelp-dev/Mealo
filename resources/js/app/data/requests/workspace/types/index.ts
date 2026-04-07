import { acceptWorkspaceInvitationRequestSchema } from '../schemas/accept-workspace-invitation.request.schema';
import { declineWorkspaceInvitationRequestSchema } from '../schemas/decline-workspace-invitation.request.schema';
import { deleteWorkspaceMemberRequestSchema } from '../schemas/delete-workspace-member.request.schema';
import { storeWorkspaceInvitationRequestSchema } from '../schemas/store-workspace-invitation.request.schema';
import { storeWorkspaceRequestSchema } from '../schemas/store-workspace.request.schema';
import { updateWorkspaceMemberRoleRequestSchema } from '../schemas/update-workspace-member-role.request.schema';
import { updateWorkspaceRequestSchema } from '../schemas/update-workspace.request.schema';
import z from 'zod';

export type StoreWorkspaceRequest = z.infer<typeof storeWorkspaceRequestSchema>;
export type UpdateWorkspaceRequest = z.infer<
  typeof updateWorkspaceRequestSchema
>;
export type DeleteWorkspaceMemberRequest = z.infer<
  typeof deleteWorkspaceMemberRequestSchema
>;
export type UpdateWorkspaceMemberRoleRequest = z.infer<
  typeof updateWorkspaceMemberRoleRequestSchema
>;
export type StoreWorkspaceInvitationRequest = z.infer<
  typeof storeWorkspaceInvitationRequestSchema
>;
export type AcceptWorkspaceInvitationRequest = z.infer<
  typeof acceptWorkspaceInvitationRequestSchema
>;
export type DeclineWorkspaceInvitationRequest = z.infer<
  typeof declineWorkspaceInvitationRequestSchema
>;
