import { useShoppingList } from '@/hooks/use-shopping-list';
import ShoppingListByRecipesIngredientItem from './shopping-list-by-recipes-ingredient-item';

export default function ShoppingListByRecipes() {
  const { shopping_list_by_recipes } = useShoppingList();

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-8 overflow-hidden">
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300`}
      >
        <div className="flex min-h-0 flex-col overflow-y-scroll">
          <div className="divide-y divide-base-300">
            {shopping_list_by_recipes.map((recipe) => (
              <>
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
                            ingredient={ingredient}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-base-300`}
      >
        <div className="flex min-h-0 flex-col overflow-y-scroll">
          <div className="divide-y divide-base-300">
            {shopping_list_by_recipes.map((recipe) => (
              <>
                {recipe.ingredients.checked.length > 0 && (
                  <>
                    <div className="flex max-w-full flex-col border-l-3 border-l-secondary px-7 py-5 font-medium text-base-content outline outline-offset-0 outline-base-300/50">
                      <span className="items-center truncate text-lg font-medium text-secondary transition-all duration-200">
                        {recipe.recipe_name}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-y-scroll">
                      <div className="divide-y divide-base-300">
                        {recipe.ingredients.checked.map((ingredient) => (
                          <ShoppingListByRecipesIngredientItem
                            ingredient={ingredient}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
