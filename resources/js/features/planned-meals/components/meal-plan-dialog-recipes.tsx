import { usePlannedMealsContextValue } from '../inertia.adapter';
import { useMultiSelectRecipe } from '@/shared/hooks/use-multi-select-recipe';
import { Clock, CookingPot } from 'lucide-react';

function MealPlanDialogRecipes() {
  const { recipes } = usePlannedMealsContextValue();

  const { selectedRecipesId, toggleRecipeSelection } = useMultiSelectRecipe();

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-6 p-1">
      {recipes.data.map((recipe) => {
        const isSelected = selectedRecipesId.includes(recipe.id);

        return (
          <div
            key={recipe.id}
            onClick={() => toggleRecipeSelection(recipe.id)}
            className={`card cursor-pointer overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-lg transition-all card-sm select-none hover:shadow-xl ${
              isSelected ? 'ring-2 ring-secondary' : ''
            }`}
          >
            {recipe.image_url ? (
              <figure className="h-48">
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="h-full w-full object-cover"
                />
              </figure>
            ) : (
              <figure className="flex h-48 items-center justify-center bg-base-200">
                <div className="text-base-content/40">
                  <svg
                    className="h-16 w-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </figure>
            )}
            <div className="card-body bg-base-100">
              <h2 className="card-title text-base-content">{recipe.name}</h2>

              <p className="line-clamp-2 text-base-content/70">
                {recipe.description}
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="badge badge-sm">
                  <Clock className="size-[1em]" />
                  <span className="text-base-content">
                    {recipe.preparation_time}min
                  </span>
                </span>
                <span className="badge badge-sm">
                  <CookingPot className="size-[1em]" />
                  <span className="text-base-content">
                    {recipe.cooking_time}min
                  </span>
                </span>
                {recipe.meal_times.map((meal_time) => (
                  <span
                    key={meal_time.id}
                    className="badge bg-base-300 badge-sm"
                  >
                    {meal_time.name}
                  </span>
                ))}
                {recipe.tags.map((tag) => (
                  <span key={tag.id} className="badge badge-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MealPlanDialogRecipes;
