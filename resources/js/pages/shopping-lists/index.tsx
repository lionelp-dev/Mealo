import { ShoppingListsInertiaAdapter } from '@/features/shopping-lists/inertia.adapter';
import ShoppingListsView from '@/features/shopping-lists/views/index.shopping-lists.view';

export default function ShoppingLists() {
  return (
    <ShoppingListsInertiaAdapter>
      <ShoppingListsView />
    </ShoppingListsInertiaAdapter>
  );
}
