import {
  DeleteRecipesRequest,
  GenerateRecipeRequest,
  RecipeFormRequest,
  StoreRecipeRequest,
  UpdateRecipeRequest,
} from '@/app/data/requests/recipe/types';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';

export const deleteRecipes = ({ ids }: DeleteRecipesRequest): Promise<void> =>
  new Promise((resolve, reject) => {
    if (ids.length === 0) resolve();
    router.delete(recipes.destroy.url(), {
      data: { ids },
      onSuccess: () => resolve(),
      onError: (errors) => {
        reject(errors);
      },
    });
  });

export const createRecipe = (
  data: StoreRecipeRequest,
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
  data: UpdateRecipeRequest,
  recipeId: string,
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

export const viewRecipe = (id: string) => {
  router.reload({ reset: ['flash'] });
  router.visit(recipes.show.url({ id }));
};

export const editRecipe = (id: string) => {
  router.reload({ reset: ['flash'] });
  router.get(recipes.edit.url({ id }));
};

export const searchTags = (params: {
  url: string;
  data: RecipeFormRequest;
}) => {
  const { url, data } = params;
  router.visit(url, {
    data,
    preserveUrl: false,
    preserveState: true,
    only: ['tags_search_results'],
    reset: ['tags_search_results'],
    replace: true,
  });
};

export const searchIngredients = (params: {
  url: string;
  data: RecipeFormRequest;
}) => {
  const { url, data } = params;
  router.visit(url, {
    data,
    preserveUrl: false,
    preserveState: true,
    only: ['ingredients_search_results'],
    reset: ['ingredients_search_results'],
    replace: true,
  });
};

export const generateRecipe = (
  data: GenerateRecipeRequest,
  options?: {
    onSuccess?: () => void;
    onFinish?: () => void;
    onError?: (error: unknown) => void;
  },
): Promise<void> =>
  new Promise((resolve, reject) => {
    router.post('/recipes/create', data, {
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
    });
  });
