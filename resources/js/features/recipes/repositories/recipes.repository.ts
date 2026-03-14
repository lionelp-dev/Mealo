import recipes from '@/routes/recipes';
import { Recipe } from '@/types';
import { router } from '@inertiajs/react';

export const deleteRecipes = (selectedRecipes: Recipe[]): Promise<void> =>
  new Promise((resolve, reject) => {
    if (selectedRecipes.length === 0) resolve();
    router.delete(recipes.destroy.url(), {
      data: { recipe_ids: selectedRecipes.map((r) => r.id) },
      onSuccess: () => resolve(),
      onError: (errors) => {
        reject(errors);
      },
    });
  });

export const createRecipe = (
  data: Omit<Recipe, 'id' | 'user_id'>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  },
): Promise<void> =>
  new Promise((resolve, reject) => {
    router.post(recipes.store.url(), data, {
      onSuccess: () => {
        options?.onSuccess?.();
        resolve();
      },
      onError: (error) => {
        options?.onError?.(error);
        reject(error);
      },
    });
  });

export const updateRecipe = (
  data: Omit<Recipe, 'id' | 'user_id'>,
  recipeId: number,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  },
): Promise<void> =>
  new Promise((resolve, reject) => {
    router.put(recipes.update.url(recipeId), data, {
      onSuccess: () => {
        options?.onSuccess?.();
        resolve();
      },
      onError: (error) => {
        options?.onError?.(error);
        reject(error);
      },
    });
  });

export const viewRecipes = () => {
  router.reload({ reset: ['flash'] });
  router.visit(recipes.index.url());
};

export const viewRecipe = (id: number) => {
  router.reload({ reset: ['flash'] });
  router.visit(recipes.show.url({ id }));
};

export const editRecipe = (id: number) => {
  router.reload({ reset: ['flash'] });
  router.get(recipes.edit.url({ id }));
};

export const searchTags = (params: { url: string; term: string }) => {
  const { url, term } = params;
  router.visit(url, {
    data: { tags_search: term },
    preserveUrl: false,
    preserveState: true,
    only: ['tags_search_results'],
    reset: ['tags_search_results'],
    replace: true,
  });
};

export const searchIngredients = (params: { url: string; term: string }) => {
  const { url, term } = params;
  router.visit(url, {
    data: { ingredients_search: term },
    preserveUrl: false,
    preserveState: true,
    only: ['ingredients_search_results'],
    reset: ['ingredients_search_results'],
    replace: true,
  });
};

export const generateRecipe = (
  prompt: string,
  options?: {
    onSuccess?: () => void;
    onFinish?: () => void;
    onError?: (error: unknown) => void;
  },
): Promise<void> =>
  new Promise((resolve, reject) => {
    router.post(
      '/recipes/create',
      { prompt: prompt },
      {
        only: ['generated_recipe', 'flash'],
        onSuccess: () => {
          options?.onSuccess?.();
        },
        onFinish: () => {
          options?.onFinish?.();
          resolve();
        },
        onError: (error) => {
          options?.onError?.(error);
          reject(error);
        },
      },
    );
  });
