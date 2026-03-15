import type { User } from '@/app/entities/user/types';

export interface Member {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
}

export interface Invitation {
  id: number;
  email: string;
  role: 'editor' | 'viewer';
  expires_at: string;
  invited_by: {
    name: string;
  };
}

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  is_personal: boolean;
  is_default: boolean;
  users_count?: number;
  user_role?: 'owner' | 'editor' | 'viewer';
  members: Member[];
  pending_invitations?: Invitation[];
  created_at: string;
  updated_at: string;
};

export type WorkspaceData = {
  current_workspace: Workspace;
  workspaces: Workspace[];
  pending_invitations?: PendingInvitation[];
};

export type WorkspaceUser = {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
};

export type WorkspaceInvitation = {
  id: number;
  workspace_id: number;
  workspace: Workspace;
  email: string;
  role: 'editor' | 'viewer';
  token: string;
  invited_by: Pick<User, 'id' | 'name'>;
  expires_at: string;
  created_at: string;
};

export type PendingInvitation = {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  workspace: Workspace & {
    owner: Pick<User, 'id' | 'name'>;
  };
};
