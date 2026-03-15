import { RecipesInertiaAdapter } from '@/app/features/recipes/inertia.adapter';
import { ShowRecipesView } from '@/app/features/recipes/views/show.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <ShowRecipesView />
    </RecipesInertiaAdapter>
  );
}
