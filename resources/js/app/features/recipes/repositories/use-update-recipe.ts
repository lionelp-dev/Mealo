import { RecipeUpdateRequest } from '@/app/data/requests/recipe/types';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useUpdateRecipe() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateRecipe = (data: RecipeUpdateRequest, recipeId: string) => {
    router.put(recipes.update.url(recipeId), data, {
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { updateRecipe, processing, errors };
}
