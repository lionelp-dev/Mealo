import { SharedData } from '@/types';
import { Workspace } from '@/types';
import { usePage } from '@inertiajs/react';

export const usePermissions = () => {
  const { auth } = usePage<SharedData>().props;

  return {
    canEditRecipe: (recipeUserId: number) => recipeUserId === auth.user.id,
    canEditWorkspace: (workspace: Workspace) =>
      workspace.owner_id === auth.user.id,
  };
};
