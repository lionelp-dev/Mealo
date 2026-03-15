import { ROLES } from '@/app/entities/';
import { SharedData } from '@/app/entities/';
import { WorkspaceData } from '@/app/entities/workspace/types';
import { usePage } from '@inertiajs/react';

type PageProps = {
  workspace_data: WorkspaceData;
} & SharedData;

export const useWorkspacePermissions = () => {
  const { auth, workspace_data } = usePage<PageProps>().props;

  const { current_workspace } = workspace_data;

  const current_user_role = current_workspace?.members.find(
    (member) => member.id === auth.user.id,
  )?.role;

  const isOwner = current_user_role === ROLES.OWNER;
  const isEditor = current_user_role === ROLES.EDITOR;
  const isViewer = current_user_role === ROLES.VIEWER;

  return {
    isOwner,
    isEditor,
    isViewer,
    canGenerateMealPlan: isOwner || isEditor,
    canEditMealPlan: isOwner || isEditor,
    canPlanMeal: isOwner || isEditor,
    canEditShoppingList: isOwner || isEditor,
    canEditCurrentWorkspace: isOwner,
  };
};
