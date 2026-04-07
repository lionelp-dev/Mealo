import { SharedData } from '@/types';
import { WorkspaceResourceData } from '@/types/generated';
import { usePage } from '@inertiajs/react';

export const usePermissions = () => {
  const { auth } = usePage<SharedData>().props;

  return {
    canEditRecipe: (recipeUserId: number) => recipeUserId === auth.user.id,
    canEditWorkspace: (workspace: WorkspaceResourceData) =>
      workspace.owner_id === auth.user.id,
  };
};
