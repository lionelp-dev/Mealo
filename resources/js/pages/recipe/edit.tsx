import { RecipesInertiaAdapter } from '@/app/features/recipes/inertia.adapter';
import { EditRecipesView } from '@/app/features/recipes/views/edit.recipes.view';

export default function () {
  return (
    <RecipesInertiaAdapter>
      <EditRecipesView />
    </RecipesInertiaAdapter>
  );
}
