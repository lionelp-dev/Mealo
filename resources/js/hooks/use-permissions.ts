import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const usePermissions = () => {
  const { auth } = usePage<SharedData>().props;

  return {
    canEditRecipe: (recipeUserId: number) => auth.user.id === recipeUserId,
  };
};
