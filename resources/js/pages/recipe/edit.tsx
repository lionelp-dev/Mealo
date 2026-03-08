import { RecipesInertiaAdapter } from '@/features/recipes/infrastructure/inertia.adapter';
import { RecipesEditPage } from '@/features/recipes/ui/recipes.edit.page';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <RecipesEditPage />
    </RecipesInertiaAdapter>
  );
}
