import { useShoppingList } from '@/hooks/use-shopping-list';
import ShoppingListByIngredientsItem from './shopping-list-by-ingredients-item';

export function ShoppingListByIngredients() {
  const { shopping_list_by_ingredients } = useShoppingList();
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-8 overflow-hidden">
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300`}
      >
        <div className="flex min-h-0 flex-col overflow-y-scroll">
          <div className="divide-y divide-base-300">
            {shopping_list_by_ingredients.unchecked.map((ingredient) => (
              <ShoppingListByIngredientsItem ingredient={ingredient} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex min-h-0 flex-col overflow-hidden rounded-md border border-base-300`}
      >
        <div className="flex flex-col overflow-scroll">
          <div className="divide-y divide-base-300">
            {shopping_list_by_ingredients.checked.map((ingredient) => (
              <ShoppingListByIngredientsItem ingredient={ingredient} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
