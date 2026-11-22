import { usePlannedMealsContextValue } from '../inertia.adapter';
import { Typography } from '@/app/components/Typography';
import { useMultiSelectRecipe } from '@/app/hooks/use-multi-select-recipe';
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
              <Typography as="h2" variant="heading" className="card-title">
                {recipe.name}
              </Typography>

              <Typography
                as="p"
                variant="body"
                tone="muted"
                className="line-clamp-2"
              >
                {recipe.description}
              </Typography>
              <div className="flex flex-wrap gap-1">
                <span className="badge badge-sm">
                  <Clock className="size-[1em]" />
                  <Typography as="span" variant="body-sm">
                    {recipe.preparation_time}min
                  </Typography>
                </span>
                <span className="badge badge-sm">
                  <CookingPot className="size-[1em]" />
                  <Typography as="span" variant="body-sm">
                    {recipe.cooking_time}min
                  </Typography>
                </span>
                {recipe.meal_times?.map((meal_time) => (
                  <Typography
                    as="span"
                    variant="body-sm"
                    key={meal_time.id}
                    className="badge bg-base-300 badge-sm"
                  >
                    {meal_time.name}
                  </Typography>
                ))}
                {recipe.tags?.map((tag) => (
                  <Typography
                    as="span"
                    variant="body-sm"
                    key={tag.id}
                    className="badge badge-sm"
                  >
                    {tag.name}
                  </Typography>
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
