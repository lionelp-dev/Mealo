import { router } from '@inertiajs/react';
import { useState } from 'react';

type SearchIngredientsRequest = {
  ingredients_search: string;
};

export function useSearchIngredients() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchIngredients = (url: string, data: SearchIngredientsRequest) => {
    router.visit(url, {
      data,
      preserveUrl: false,
      preserveState: true,
      only: ['ingredients_search_results'],
      reset: ['ingredients_search_results'],
      replace: true,
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { searchIngredients, processing, errors };
}
