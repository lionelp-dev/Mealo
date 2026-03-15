import { SharedData } from '@/app/entities/';
import { Workspace } from '@/app/entities/workspace/types';
import { usePage } from '@inertiajs/react';

export const usePermissions = () => {
  const { auth } = usePage<SharedData>().props;

  return {
    canEditRecipe: (recipeUserId: number) => recipeUserId === auth.user.id,
    canEditWorkspace: (workspace: Workspace) =>
      workspace.owner_id === auth.user.id,
  };
};
