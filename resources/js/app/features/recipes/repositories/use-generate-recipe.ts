import { RecipeAIGenerationRequest } from '@/app/data/requests/recipe/types';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useGenerateRecipe() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const generateRecipe = (data: RecipeAIGenerationRequest) => {
    router.post(recipes.aiGeneration.url(), data, {
      only: ['generated_recipe', 'generated_image_data_url', 'flash'],
      onBefore: () => {
        setProcessing(true);
        setWasSuccessful(false);
      },
      onSuccess: () => {
        setErrors({});
        setWasSuccessful(true);
      },
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  const resetSuccess = () => setWasSuccessful(false);

  return { generateRecipe, processing, errors, wasSuccessful, resetSuccess };
}
