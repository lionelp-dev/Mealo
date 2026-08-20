import { RecipeAIGenerateRequest } from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useGenerateRecipes() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const generateRecipes = (data: RecipeAIGenerateRequest) => {
    const hasPrompt = !!data.prompt && data.prompt.trim() !== '';
    const payload = {
      context: data.context,
      image_generation: data.image_generation,
      ...(hasPrompt ? { prompt: data.prompt } : {}),
    };

    router.post(recipes.aiGeneration.url(), payload, {
      preserveScroll: true,
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

  return { generateRecipes, processing, errors, wasSuccessful, resetSuccess };
}
