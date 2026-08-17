import { RecipeAIGenerateRequest } from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useGenerateRecipes() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const generateRecipes = (data: RecipeAIGenerateRequest) => {
    // Only send a prompt when one is actually set: an empty string would trip
    // the backend `sometimes|min:5` rule and fail validation.
    const hasPrompt = !!data.prompt && data.prompt.trim() !== '';
    const payload = {
      context: data.context,
      image_generation: data.image_generation,
      ...(hasPrompt ? { prompt: data.prompt } : {}),
    };

    // Full Inertia visit (not a partial reload): the recipes list is an
    // `Inertia::scroll` merge prop, so a full re-render is required for newly
    // generated recipes to appear at the top of the list.
    router.post(recipes.aiGenerate.url(), payload, {
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
