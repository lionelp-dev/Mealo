import { RecipesInertiaAdapter } from '@/app/features/recipes/inertia.adapter';
import { IndexRecipesView } from '@/app/features/recipes/views/index.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <IndexRecipesView />
    </RecipesInertiaAdapter>
  );
}
