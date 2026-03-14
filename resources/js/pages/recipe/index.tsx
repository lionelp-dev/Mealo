import { RecipesInertiaAdapter } from '@/features/recipes/inertia.adapter';
import { IndexRecipesView } from '@/features/recipes/views/index.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <IndexRecipesView />
    </RecipesInertiaAdapter>
  );
}
