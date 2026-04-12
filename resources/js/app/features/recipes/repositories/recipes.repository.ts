import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';

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
