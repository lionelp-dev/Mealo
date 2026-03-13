import ShoppingListByRecipesIngredientItem from './shopping-list-by-recipes-ingredient-item';
import { useShoppingList } from '@/hooks/use-shopping-list';
import React from 'react';

export default function ShoppingListByRecipes() {
  const { shopping_list_by_recipes } = useShoppingList();

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-8 overflow-hidden">
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300`}
      >
        <div className="flex min-h-0 overflow-y-scroll">
          <div className="w-full divide-y divide-base-300">
            {shopping_list_by_recipes.map((recipe) => (
              <React.Fragment key={recipe.recipe_id}>
                {recipe.ingredients.unchecked.length > 0 && (
                  <>
                    <div className="flex max-w-full items-center gap-2 border-l-3 border-l-secondary px-7 py-4 font-medium text-base-content outline outline-offset-0 outline-base-300/50">
                      <span className="items-center truncate text-lg font-medium text-secondary transition-all duration-200">
                        {recipe.recipe_name}
                      </span>
                      <span>{'-'}</span>
                      <span className="text-sm whitespace-nowrap text-secondary">
                        {recipe.ingredients.unchecked.length} ingrédient(s)
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-y-scroll">
                      <div className="divide-y divide-base-300">
                        {recipe.ingredients.unchecked.map((ingredient) => (
                          <ShoppingListByRecipesIngredientItem
                            key={`${ingredient.shopping_list_id}-${ingredient.ingredient_id}-${ingredient.unit}-${ingredient.is_checked}`}
                            ingredient={ingredient}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300`}
      >
        <div className="flex min-h-0 flex-col overflow-y-scroll">
          <div className="w-full divide-y divide-base-300">
            {shopping_list_by_recipes.map((recipe) => (
              <React.Fragment key={recipe.recipe_id}>
                {recipe.ingredients.checked.length > 0 && (
                  <>
                    <div className="flex max-w-full flex-col border-l-3 px-7 py-5 font-medium text-base-content outline outline-offset-0 outline-base-300/50">
                      <span className="items-center truncate text-lg font-medium text-base-content/50 line-through transition-all duration-200">
                        {recipe.recipe_name}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-y-scroll">
                      <div className="divide-y divide-base-300">
                        {recipe.ingredients.checked.map((ingredient) => (
                          <ShoppingListByRecipesIngredientItem
                            key={`${ingredient.shopping_list_id}-${ingredient.ingredient_id}-${ingredient.unit}-${ingredient.is_checked}`}
                            ingredient={ingredient}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
