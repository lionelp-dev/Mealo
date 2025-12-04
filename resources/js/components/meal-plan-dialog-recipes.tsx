import { PaginatedCollection, Recipe } from '@/types';
import { InfiniteScroll, usePage } from '@inertiajs/react';

import { useRecipeSearchStore } from '@/stores/recipe-search';
import { useMealPlanDialogControllerStore } from '../stores/meal-plan-dialog';

type PageProps = {
  recipes: PaginatedCollection<Recipe>;
};

function MealPlanDialogRecipes() {
  const { recipes } = usePage<PageProps>().props;

  const { searchTerm, activeFilters, isSearching } = useRecipeSearchStore();

  const { selectedRecipesId, toggleRecipeSelection } =
    useMealPlanDialogControllerStore();

  if (isSearching) {
    return (
      <div className="overflow-y-scroll">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            <span>Searching recipes...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!recipes || !recipes.data || recipes.data.length === 0) {
    return (
      <div className="overflow-y-scroll">
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">No recipes found</p>
            {(searchTerm || activeFilters.length > 0) && (
              <p className="text-sm">Try adjusting your search or filters</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll">
      <InfiniteScroll data="recipes">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {recipes.data.map((recipe, id) => {
            const isSelected = selectedRecipesId.includes(recipe.id);

            return (
              <div
                key={id}
                onClick={() => toggleRecipeSelection(recipe.id)}
                className={`cursor-pointer rounded-lg border border-solid p-5 px-6 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 ${
                  isSelected
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <span className="text-base font-semibold text-gray-800">
                  {recipe.name}
                </span>

                <span className="flex gap-4 text-xs text-gray-500">
                  <span>Prep: {recipe.preparation_time} min</span>
                  <span>Cooking: {recipe.cooking_time} min</span>
                </span>

                <span className="min-h-[3lh] overflow-hidden text-sm leading-normal text-ellipsis text-gray-600">
                  {recipe.description}
                </span>

                <div className="flex flex-wrap items-center gap-y-3 [&>span:not(:first-child)]:ml-3">
                  {recipe.meal_times.map((meal_time) => (
                    <span
                      key={meal_time.id}
                      className="h-fit rounded-full bg-gray-100 px-3 py-0.5 text-xs leading-tight"
                    >
                      {meal_time.name}
                    </span>
                  ))}

                  {recipe.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="w-min overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-500"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default MealPlanDialogRecipes;
