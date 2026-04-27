import { workspaceInvitationAcceptRequestSchema } from '../schemas/workspace-invitation-accept.request.schema';
import { workspaceInvitationDeclineRequestSchema } from '../schemas/workspace-invitation-decline.request.schema';
import { workspaceInvitationStoreRequestSchema } from '../schemas/workspace-invitation-store.request.schema';
import { workspaceDeleteMemberRequestSchema } from '../schemas/workspace-member-delete.request.schema';
import { workspaceMemberRoleUpdateRequestSchema } from '../schemas/workspace-member-role-update.request.schema';
import { workspaceStoreRequestSchema } from '../schemas/workspace-store.request.schema';
import { workspaceUpdateRequestSchema } from '../schemas/workspace-update.request.schema';
import z from 'zod';

export type WorkspaceStoreRequest = z.infer<typeof workspaceStoreRequestSchema>;
export type WorkspaceUpdateRequest = z.infer<
  typeof workspaceUpdateRequestSchema
>;
export type WorkspaceDeleteMemberRequest = z.infer<
  typeof workspaceDeleteMemberRequestSchema
>;
export type WorkspaceUpdateMemberRoleRequest = z.infer<
  typeof workspaceMemberRoleUpdateRequestSchema
>;
export type WorkspaceStoreInvitationRequest = z.infer<
  typeof workspaceInvitationStoreRequestSchema
>;
export type WorkspaceAcceptInvitationRequest = z.infer<
  typeof workspaceInvitationAcceptRequestSchema
>;
export type WorkspaceDeclineInvitationRequest = z.infer<
  typeof workspaceInvitationDeclineRequestSchema
>;
