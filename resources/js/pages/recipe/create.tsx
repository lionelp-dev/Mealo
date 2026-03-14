import { RecipesInertiaAdapter } from '@/features/recipes/inertia.adapter';
import { CreateRecipesView } from '@/features/recipes/views/create.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <CreateRecipesView />
    </RecipesInertiaAdapter>
  );
}
