import { RecipeAIGenerateRequest } from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

type GenerateRecipePreviewOptions = {
  onSuccess?: () => void;
};

export function useGenerateRecipePreview() {
  const [processing, setProcessing] = useState(false);

  const generateRecipePreview = (
    prompt: string,
    options: GenerateRecipePreviewOptions = {},
  ) => {
    const payload: RecipeAIGenerateRequest = {
      prompt,
      context: {
        count: 1,
        meal_time: null,
        meal_times: [],
      },
      image_generation: false,
    };

    router.post(recipes.aiGenerationPreview.url(), payload, {
      only: ['generated_recipe', 'flash'],
      preserveScroll: true,
      preserveState: true,
      preserveUrl: true,
      onBefore: () => setProcessing(true),
      onSuccess: (page) => {
        if (page.props.generated_recipe) options.onSuccess?.();
      },
      onFinish: () => setProcessing(false),
    });
  };

  return {
    generateRecipePreview,
    processing,
  };
}
