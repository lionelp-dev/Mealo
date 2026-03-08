import { RecipesInertiaAdapter } from '@/features/recipes/infrastructure/inertia.adapter';
import { RecipesCreatePage } from '@/features/recipes/ui/recipes.create.page';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <RecipesCreatePage />
    </RecipesInertiaAdapter>
  );
}
