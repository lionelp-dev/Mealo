import MealPlanningPopover from './meal-planning-popover';
import { useMultiSelectRecipe } from '@/shared/hooks/use-multi-select-recipe';
import { useRecipesFiltersStore } from '@/shared/stores/recipes-filters-store';
import { Recipe } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RecipeCardProps = {
  recipe: Recipe;
};

export function MealPlanRecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation();

  const { isFilterActive } = useRecipesFiltersStore();

  const { isMultiSelectMode, selectedRecipesId, toggleRecipeSelection } =
    useMultiSelectRecipe();

  const [isMealPlanningPopoverOpen, setIsMealPlanningPopoverOpen] =
    useState<boolean>(false);

  return (
    <div
      key={recipe.id}
      className={`card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-lg ${!isMultiSelectMode && 'hover:[&_.plan-meal-btn]:opacity-100'}`}
      onClick={() => {
        if (isMultiSelectMode) {
          return toggleRecipeSelection(recipe.id);
        }
        setIsMealPlanningPopoverOpen(true);
      }}
    >
      <div className="relative">
        {isMultiSelectMode && (
          <input
            className="radio absolute top-4 right-4 border-base-300 bg-base-100/85 radio-sm checked:border-secondary checked:text-secondary"
            type="radio"
            checked={selectedRecipesId.includes(recipe.id)}
            onChange={() => {
              toggleRecipeSelection(recipe.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}

        <MealPlanningPopover
          recipe={recipe}
          isMultiSelectMode={isMultiSelectMode}
          isMealPlanningPopoverOpen={isMealPlanningPopoverOpen}
          setIsMealPlanningPopoverOpen={setIsMealPlanningPopoverOpen}
        />

        {recipe.image_url ? (
          <figure className="h-42">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          </figure>
        ) : (
          <figure className="flex h-42 items-center justify-center bg-base-200"></figure>
        )}

        <div className="absolute right-0 bottom-2 left-0 flex max-h-[1.3lh] flex-wrap justify-start gap-2 overflow-hidden p-2">
          <div className="flex max-h-[1lh] flex-wrap gap-3">
            {recipe.meal_times.map((meal_time) => (
              <span
                key={meal_time.id}
                className={`badge bg-base-100/70 badge-sm whitespace-nowrap text-base-content ${isFilterActive({ type: 'meal_time', value: meal_time.id.toString() }) && 'bg-secondary/80 text-secondary-content'}`}
              >
                {t(
                  `mealPlanning.dialog.filters.${meal_time.name}`,
                  meal_time.name,
                )}
              </span>
            ))}
            {recipe.tags.map((tag) => (
              <span
                key={tag.id}
                className={`badge bg-base-100/80 badge-sm whitespace-nowrap text-base-content ${tag.id && isFilterActive({ type: 'tag', value: tag.id.toString() }) && 'bg-secondary/80 text-secondary-content'}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="flex flex-col gap-2">
          <h2 className="card-title text-base-content">{recipe.name}</h2>
          <p className="line-clamp-2 text-base-content/70">
            {recipe.description}
          </p>
        </div>
      </div>
    </div>
  );
}
