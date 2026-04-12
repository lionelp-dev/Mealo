import { GenerateRecipeRequest } from '@/app/data/requests/recipe/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useGenerateRecipe() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateRecipe = (data: GenerateRecipeRequest) => {
    router.post('/recipes/create', data, {
      only: ['generated_recipe', 'flash'],
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { generateRecipe, processing, errors };
}
