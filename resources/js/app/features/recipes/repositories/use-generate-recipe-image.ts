import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useGenerateRecipeImage() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const generateRecipeImage = (
    name: string,
    ingredients?: Array<{ name: string; quantity: number; unit: string }>,
  ) => {
    router.post(
      recipes.aiImageGeneration.url(),
      {
        name,
        ingredients: ingredients ?? null,
      },
      {
        only: ['generated_image_data_url', 'flash'],
        reset: ['generated_image_data_url', 'flash'],
        preserveState: true,
        preserveUrl: true,
        onBefore: () => setProcessing(true),
        onSuccess: () => {
          setProcessing(false);
        },
        onError: (errs) => setErrors(Object.values(errs)),
        onFinish: () => setProcessing(false),
      },
    );
  };

  return {
    generateRecipeImage,
    processing,
    errors,
  };
}
