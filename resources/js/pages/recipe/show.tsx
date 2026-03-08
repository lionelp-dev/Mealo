import { RecipesInertiaAdapter } from '@/features/recipes/infrastructure/inertia.adapter';
import { RecipesShowPage } from '@/features/recipes/ui/recipes.show.page';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <RecipesShowPage />
    </RecipesInertiaAdapter>
  );
}
