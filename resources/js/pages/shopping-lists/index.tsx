import { ShoppingListsInertiaAdapter } from '@/app/features/shopping-lists/inertia.adapter';
import ShoppingListsView from '@/app/features/shopping-lists/views/index.shopping-lists.view';

export default function ShoppingLists() {
  return (
    <ShoppingListsInertiaAdapter>
      <ShoppingListsView />
    </ShoppingListsInertiaAdapter>
  );
}
