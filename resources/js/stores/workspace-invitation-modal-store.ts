import { create } from 'zustand';

type WorkspaceInvitationModalState = {
  selected_workspace_id: number | null;
  isWorkspaceInvitationModalOpen: boolean;
  isWorkspaceInviting: boolean;
};

type WorkspaceInvitationModalStore = {
  setWorkspaceInviting: (isInviting: boolean) => void;
  openWorkspaceInvitationModal: (selected_workspace_id: number) => void;
  closeWorkspaceInvitationModal: () => void;
};

const initialState: WorkspaceInvitationModalState = {
  selected_workspace_id: null,
  isWorkspaceInvitationModalOpen: false,
  isWorkspaceInviting: false,
};

export const workspaceInvitationModalStore = create<
  WorkspaceInvitationModalState & WorkspaceInvitationModalStore
>((set) => ({
  ...initialState,
  setWorkspaceInviting: (isWorkspaceInviting) => set({ isWorkspaceInviting }),
  openWorkspaceInvitationModal: (selected_workspace_id) =>
    set({ selected_workspace_id, isWorkspaceInvitationModalOpen: true }),
  closeWorkspaceInvitationModal: () =>
    set({ selected_workspace_id: null, isWorkspaceInvitationModalOpen: false }),
}));
