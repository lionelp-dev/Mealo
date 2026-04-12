import { DeleteRecipesRequest } from '@/app/data/requests/recipe/types';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useDeleteRecipes() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deleteRecipes = ({ ids }: DeleteRecipesRequest) => {
    if (ids.length === 0) return;

    router.delete(recipes.destroy.url(), {
      data: { ids },
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { deleteRecipes, processing, errors };
}
