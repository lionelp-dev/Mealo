import { useMealPlanData } from '../hooks/use-meal-plan-data';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';

function MealPlanDialogRecipes() {
  const { recipes } = useMealPlanData();

  const { selectedRecipesId, toggleRecipeSelection } = useMealPlanDialogStore();

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {recipes.data.map((recipe, id) => {
        const isSelected = selectedRecipesId.includes(recipe.id);

        return (
          <div
            key={id}
            onClick={() => toggleRecipeSelection(recipe.id)}
            className={`cursor-pointer rounded-lg border border-solid p-5 px-6 transition-all duration-200 hover:border-base-300 ${
              isSelected ? 'border-base-300 bg-base-200' : 'border-base-200'
            }`}
          >
            <span className="text-base font-semibold text-base-content">
              {recipe.name}
            </span>

            <span className="flex gap-4 text-xs text-base-content">
              <span>Prep: {recipe.preparation_time} min</span>
              <span>Cooking: {recipe.cooking_time} min</span>
            </span>

            <span className="min-h-[3lh] overflow-hidden text-sm leading-normal text-ellipsis text-base-content">
              {recipe.description}
            </span>

            <div className="flex flex-wrap items-center gap-y-3 [&>span:not(:first-child)]:ml-3">
              {recipe.meal_times.map((meal_time) => (
                <span
                  key={meal_time.id}
                  className="h-fit rounded-full bg-base-300 px-3 py-0.5 text-xs leading-tight text-base-content"
                >
                  {meal_time.name}
                </span>
              ))}

              {recipe.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="w-min overflow-hidden text-xs text-ellipsis whitespace-nowrap text-base-content"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MealPlanDialogRecipes;
