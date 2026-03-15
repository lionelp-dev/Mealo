import { create } from 'zustand';

type WorkspaceEditState = {
  selected_workspace_id: number | null;
  isWorkspaceEditModalOpen: boolean;
  isWorkspaceUpdating: boolean;
};

type WorkspaceEditStore = {
  setWorkspaceUpdating: (isUpdating: boolean) => void;
  openWorkspaceEditModal: (selected_workspace_id: number) => void;
  closeWorkspaceEditModal: () => void;
};

const initialState: WorkspaceEditState = {
  selected_workspace_id: null,
  isWorkspaceEditModalOpen: false,
  isWorkspaceUpdating: false,
};

export const workspaceEditStore = create<
  WorkspaceEditState & WorkspaceEditStore
>((set) => ({
  ...initialState,
  setWorkspaceUpdating: (isWorkspaceUpdating) => set({ isWorkspaceUpdating }),
  openWorkspaceEditModal: (selected_workspace_id) =>
    set({
      selected_workspace_id,
      isWorkspaceEditModalOpen: true,
    }),
  closeWorkspaceEditModal: () =>
    set({ selected_workspace_id: null, isWorkspaceEditModalOpen: false }),
}));
