import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import { capitalize, cn } from '@/lib/utils';
import { PlannedMealRecipeIngredient } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function ShoppingListByRecipesIngredientItem({
  ingredient,
}: {
  ingredient: PlannedMealRecipeIngredient;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { canEditShoppingList } = useWorkspacePermissions();

  const toggleChecked = async () => {
    if (isLoading) return;

    router.put(
      `/shopping-lists`,
      {
        shopping_list_planned_meal_ingredients:
          ingredient.from_planned_meals.map((planned_meal) => {
            return {
              shopping_list_id: ingredient.shopping_list_id,
              planned_meal_id: planned_meal.planned_meal_id,
              ingredient_id: ingredient.ingredient_id,
              is_checked: !planned_meal.is_checked,
            };
          }),
      },
      {
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      },
    );

    setIsLoading(true);
  };

  return (
    <label
      className={cn(
        'flex items-center gap-3 px-7 py-4 hover:bg-secondary/5',
        ingredient.is_checked ? 'bg-base-200' : '',
      )}
    >
      {canEditShoppingList && (
        <input
          type="checkbox"
          checked={ingredient.is_checked}
          onChange={toggleChecked}
          disabled={isLoading}
          className={cn(
            'checkbox shrink-0 self-center checkbox-xs hover:checkbox-secondary',
            ingredient.is_checked && 'checkbox-secondary',
          )}
        />
      )}
      <span className="flex min-w-0 flex-1 items-center justify-start gap-1 px-1 pb-[1px]">
        <span
          className={cn(
            'text-md min-w-0 truncate font-medium text-base-content transition-all duration-200',
            ingredient.is_checked && 'line-through opacity-60',
          )}
        >
          {capitalize(ingredient.name)}
        </span>
        <span className="shrink-0">{'-'}</span>
        <span className="shrink-0 text-sm whitespace-nowrap text-base-content/70 transition-all duration-200">
          {ingredient.total_quantity} {ingredient.unit}
        </span>
      </span>
    </label>
  );
}
