import { create } from 'zustand';

type WorkspaceCreationState = {
  isWorkspaceCreationModalOpen: boolean;
  isWorkspaceCreating: boolean;
};

type WorkspaceCreationStore = {
  setWorkspaceCreating: (isCreating: boolean) => void;
  openWorkspaceCreationModal: () => void;
  closeWorkspaceCreationModal: () => void;
};

const initialState: WorkspaceCreationState = {
  isWorkspaceCreationModalOpen: false,
  isWorkspaceCreating: false,
};

export const workspaceCreationStore = create<
  WorkspaceCreationState & WorkspaceCreationStore
>((set) => ({
  ...initialState,
  setWorkspaceCreating: (isWorkspaceCreating) =>
    set({ isWorkspaceCreating }),
  openWorkspaceCreationModal: () =>
    set({ isWorkspaceCreationModalOpen: true }),
  closeWorkspaceCreationModal: () =>
    set({ isWorkspaceCreationModalOpen: false }),
}));
