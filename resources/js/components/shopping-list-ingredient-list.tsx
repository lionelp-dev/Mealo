import { ShoppingList } from '@/types';
import ShoppingListIngredientItem from './shopping-list-ingredient-item';

type ShoppingListIngredientListProps = {
  shoppingList: ShoppingList;
};

export default function ShoppingListIngredientList({
  shoppingList,
}: ShoppingListIngredientListProps) {
  const ingredients = shoppingList?.data.ingredients || [];

  const checkedIngredients = ingredients.filter(
    (ingredient) => ingredient.is_checked,
  );
  const uncheckedIngredients = ingredients.filter(
    (ingredient) => !ingredient.is_checked,
  );

  const totalCount = ingredients.length;
  const checkedCount = checkedIngredients.length;
  const progressPercentage =
    totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  if (ingredients.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <div className="text-center">
          <p className="text-lg">No ingredients in this shopping list</p>
          <p className="text-sm">Plan some meals to add ingredients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden px-10 py-5">
      {/* Progress indicator */}
      <div className="flex flex-col px-4 pb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-md font-medium">Shopping list progress</span>
          <span className="text-sm text-gray-600">
            {checkedCount} of {totalCount} completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-700 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 gap-7 overflow-hidden max-xl:flex-col">
        {/* Unchecked ingredients */}
        {uncheckedIngredients.length > 0 && (
          <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-300 bg-white">
            <div className="border-b border-gray-300 px-7 py-4">
              <h3 className="font-medium text-gray-900">To buy</h3>
              <p className="text-sm text-gray-500">
                {uncheckedIngredients.length} items
              </p>
            </div>
            <div className="flex flex-col overflow-y-scroll">
              <div className="divide-y divide-gray-300">
                {uncheckedIngredients.map((ingredient) => (
                  <ShoppingListIngredientItem
                    key={ingredient.id}
                    ingredient={ingredient}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Checked ingredients */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-gray-300 bg-white">
          <div className="flex flex-col border-b border-gray-300 px-7 py-4">
            <h3 className="font-medium text-gray-900">Completed</h3>
            <p className="text-sm text-gray-500">
              {checkedIngredients.length} items checked off
            </p>
          </div>
          <div className="flex flex-col overflow-y-scroll">
            <div className="divide-y divide-gray-300">
              {checkedIngredients.map((ingredient) => (
                <ShoppingListIngredientItem
                  key={ingredient.id}
                  ingredient={ingredient}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
