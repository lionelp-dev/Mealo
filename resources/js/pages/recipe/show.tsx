import { RecipesInertiaAdapter } from '@/features/recipes/inertia.adapter';
import { ShowRecipesView } from '@/features/recipes/views/show.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <ShowRecipesView />
    </RecipesInertiaAdapter>
  );
}
