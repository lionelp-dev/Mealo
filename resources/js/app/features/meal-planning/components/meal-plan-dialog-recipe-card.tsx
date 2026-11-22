import MealPlanningPopover from './meal-planning-popover';
import { Typography } from '@/app/components/Typography';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { useMultiSelectRecipe } from '@/app/hooks/use-multi-select-recipe';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RecipeCardProps = {
  recipe: RecipeResource;
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
      className={`card cursor-pointer overflow-hidden rounded-2xl bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl ${!isMultiSelectMode && 'hover:[&_.plan-meal-btn]:opacity-100'}`}
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
          <figure className="h-38">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          </figure>
        ) : (
          <figure className="flex h-42 items-center justify-center bg-base-200"></figure>
        )}
      </div>

      <div className="card-body">
        <div className="flex min-w-0 flex-col gap-2">
          <Typography as="h2" variant="heading" className="card-title">
            <Typography
              as="span"
              variant="body-sm"
              className="min-w-0 truncate"
            >
              {recipe.name}
            </Typography>
          </Typography>
          <div className="flex min-w-0 flex-nowrap gap-2 overflow-hidden">
            {recipe.meal_times?.map((mealTime) => {
              const isActive = isFilterActive({
                type: 'meal_time',
                value: mealTime.id.toString(),
              });

              return (
                <Typography
                  as="span"
                  variant="body-sm"
                  key={mealTime.id}
                  tone={isActive ? 'inverse' : 'default'}
                  className={`badge shrink-0 bg-base-200 badge-sm whitespace-nowrap ${isActive && 'bg-secondary/80'}`}
                >
                  {t(
                    `mealPlanning.dialog.filters.${mealTime.slug}`,
                    mealTime.name,
                  )}
                </Typography>
              );
            })}
            {recipe.tags?.map((tag) => {
              const isActive =
                !!tag.id &&
                isFilterActive({ type: 'tag', value: tag.id.toString() });

              return (
                <Typography
                  as="span"
                  variant="body-sm"
                  key={tag.id}
                  tone={isActive ? 'inverse' : 'default'}
                  className={`badge shrink-0 bg-base-200 badge-sm whitespace-nowrap ${isActive && 'bg-secondary/80'}`}
                >
                  {tag.name}
                </Typography>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
