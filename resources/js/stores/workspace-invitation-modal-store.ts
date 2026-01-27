import { Workspace } from '@/types';
import { create } from 'zustand';

type WorkspaceInvitationModalState = {
  data: { workspace: Workspace } | null;
  isWorkspaceInvitationModalOpen: boolean;
  isWorkspaceInviting: boolean;
};

type WorkspaceInvitationModalStore = {
  setWorkspaceInviting: (isInviting: boolean) => void;
  openWorkspaceInvitationModal: (workspace: Workspace) => void;
  closeWorkspaceInvitationModal: () => void;
};

const initialState: WorkspaceInvitationModalState = {
  data: null,
  isWorkspaceInvitationModalOpen: false,
  isWorkspaceInviting: false,
};

export const workspaceInvitationModalStore = create<
  WorkspaceInvitationModalState & WorkspaceInvitationModalStore
>((set) => ({
  ...initialState,
  setWorkspaceInviting: (isWorkspaceInviting) =>
    set({ isWorkspaceInviting }),
  openWorkspaceInvitationModal: (workspace) =>
    set({ data: { workspace }, isWorkspaceInvitationModalOpen: true }),
  closeWorkspaceInvitationModal: () =>
    set({ data: null, isWorkspaceInvitationModalOpen: false }),
}));
