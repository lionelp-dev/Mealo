import { useState } from 'react';

import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import { capitalize, cn } from '@/lib/utils';
import { PlannedMealIngredient } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronDown, DotIcon } from 'lucide-react';

type ShoppingListByIngredientsItemProps = {
  ingredient: PlannedMealIngredient;
};

export default function ShoppingListByIngredientsItem({
  ingredient,
}: ShoppingListByIngredientsItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { canEditShoppingList } = useWorkspacePermissions();

  const toggleChecked = async () => {
    if (isLoading) return;

    router.put(
      `/shopping-lists`,
      {
        shopping_list_planned_meal_ingredients:
          ingredient.from_planned_meals.map((item) => {
            return {
              shopping_list_id: ingredient.shopping_list_id,
              planned_meal_id: item.planned_meal_id,
              ingredient_id: ingredient.ingredient_id,
              is_checked: !ingredient.is_checked,
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

  const from_recipe_count = ingredient.from_recipes.length;

  const [showMoreFromRecipes, setShowMoreFromRecipes] =
    useState<boolean>(false);

  return (
    <label
      className={cn(
        'flex items-center gap-5 px-5 select-none',
        ingredient.is_checked
          ? 'bg-base-200 hover:bg-secondary/15'
          : 'hover:bg-secondary/5',
        isLoading && 'opacity-50',
      )}
    >
      <div className="grid w-full grid-cols-[auto_1fr] grid-rows-[2.35rem_auto_auto] gap-x-4 gap-y-1.5 pb-2.5">
        {canEditShoppingList && (
          <input
            type="checkbox"
            checked={ingredient.is_checked}
            onChange={toggleChecked}
            disabled={isLoading}
            className={cn(
              'checkbox flex-shrink-0 self-end checkbox-xs hover:checkbox-secondary',
              ingredient.is_checked && 'checkbox-secondary',
            )}
          />
        )}

        <span className="-mb-1 flex h-fit items-center gap-1 self-end px-1">
          <span
            className={cn(
              'text-md flex items-center gap-2 font-medium text-base-content transition-all duration-200',
              ingredient.is_checked && 'line-through',
            )}
          >
            {capitalize(ingredient.name)}
          </span>
          <span>{'-'}</span>
          <span
            className={cn(
              'text-sm text-base-content/70 transition-all duration-200',
            )}
          >
            {ingredient.total_quantity} {ingredient.unit}
          </span>
        </span>

        {ingredient.from_recipes && ingredient.from_recipes.length > 0 && (
          <div
            className={cn(
              'col-start-2 row-start-2 flex flex-col pl-0.5',
              showMoreFromRecipes && 'gap-1',
            )}
          >
            {ingredient.from_recipes.map((recipe, key) => (
              <div
                key={recipe.recipe_id}
                className={cn(
                  'grid transition-all duration-250 ease-out',
                  key >= 1 && !showMoreFromRecipes
                    ? 'grid-rows-[0fr] opacity-0'
                    : 'grid-rows-[1fr] opacity-100',
                )}
              >
                <div className="overflow-hidden">
                  <span
                    className={cn(
                      'badge w-fit justify-start gap-0 rounded-full badge-soft badge-xs px-2.5 py-2 font-normal',
                      ingredient.is_checked
                        ? 'badge-success'
                        : 'badge-secondary',
                    )}
                  >
                    <span className="truncate text-secondary/90">
                      {capitalize(recipe.recipe_name)}
                    </span>
                    <DotIcon className="-mx-1 -ml-[5px] h-6 w-6 shrink-0" />
                    <span className="text-secondary/80">
                      {recipe.ingredient_quantity}
                      {recipe.ingredient_unit}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {from_recipe_count > 1 && (
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMoreFromRecipes(!showMoreFromRecipes);
            }}
            className="col-start-2 mx-1.5 badge flex items-center gap-1 self-center border-none bg-transparent badge-xs text-secondary/80 hover:link"
          >
            <span>
              {!showMoreFromRecipes &&
                from_recipe_count === 2 &&
                `Voir l'autre recette`}

              {!showMoreFromRecipes &&
                from_recipe_count > 2 &&
                `Voir les ${from_recipe_count} autres recettes`}

              {showMoreFromRecipes &&
                from_recipe_count === 2 &&
                `Masquer l'autre recette`}

              {showMoreFromRecipes &&
                from_recipe_count > 2 &&
                `Masquer ${from_recipe_count} les autres  recettes`}
            </span>
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-all',
                showMoreFromRecipes && '-rotate-180',
              )}
            />
          </span>
        )}
      </div>
    </label>
  );
}
