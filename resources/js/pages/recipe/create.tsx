import { RecipesInertiaAdapter } from '@/app/features/recipes/inertia.adapter';
import { CreateRecipesView } from '@/app/features/recipes/views/create.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <CreateRecipesView />
    </RecipesInertiaAdapter>
  );
}
