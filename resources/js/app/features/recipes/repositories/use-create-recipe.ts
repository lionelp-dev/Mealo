import { RecipeStoreRequest } from '@/app/data/requests/recipe/types';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useCreateRecipe() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createRecipe = (data: RecipeStoreRequest) => {
    router.post(recipes.store.url(), data, {
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { createRecipe, processing, errors };
}
