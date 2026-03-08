import { RecipesInertiaAdapter } from '@/features/recipes/infrastructure/inertia.adapter';
import { RecipesIndexPage } from '@/features/recipes/ui/recipes.index.page';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <RecipesIndexPage />
    </RecipesInertiaAdapter>
  );
}
