import { Recipe } from '@/types';

import { useMealPlanContext } from '@/contexts/meal-plan-context';
import { useMealPlanActions } from '@/hooks/use-meal-plan-actions';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import * as Popover from '@radix-ui/react-popover';
import { Calendar, CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';

type RecipeCardProps = {
  recipe: Recipe;
};

export function MealPlanRecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation();

  const { mealTimes } = useMealPlanContext();

  const [openPlanPopover, setOpenPlanPopover] = useState<boolean>(false);

  const { selectedDate, setIsOpen } = useMealPlanDialogStore();

  const { planMeals } = useMealPlanActions();

  const { isFilterActive } = useRecipeFiltersStore();

  const { isMultiSelectMode, selectedRecipesId, toggleRecipeSelection } =
    useMultiSelectRecipe();

  return (
    <div
      key={recipe.id}
      className={`card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-lg ${!isMultiSelectMode && 'hover:[&_.plan-meal-btn]:opacity-100'}`}
      onClick={() => {
        if (isMultiSelectMode) {
          return toggleRecipeSelection(recipe.id);
        }
        setOpenPlanPopover(true);
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
        <Popover.Root open={openPlanPopover} onOpenChange={setOpenPlanPopover}>
          <Popover.Trigger asChild>
            <button
              className={`plan-meal-btn btn absolute top-4 right-3 btn-circle border-base-300/75 opacity-0 btn-lg`}
              onClick={(e) => e.stopPropagation()}
              disabled={isMultiSelectMode}
            >
              <span>
                <CalendarPlus size={16} />
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-[10000] min-w-[200px] rounded-lg border border-base-300 bg-base-100 p-2 shadow-xl"
              side="top"
              align="end"
              sideOffset={8}
              alignOffset={-4}
              onPointerLeave={() => {
                setOpenPlanPopover(false);
              }}
            >
              <div className="flex flex-col gap-2">
                {selectedDate && (
                  <div className="flex gap-2 rounded-sm bg-base-200 px-2 py-2 text-xs text-base-content/60">
                    <Calendar size={14} />
                    {selectedDate
                      ?.setLocale(i18n.language)
                      .toFormat('EEEE d MMMM')[0]
                      .toUpperCase() +
                      selectedDate
                        ?.setLocale(i18n.language)
                        .toFormat('EEEE d MMMM')
                        .slice(1)}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {mealTimes.map((mealTime) => (
                    <button
                      key={mealTime.id}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-base-200 disabled:opacity-50"
                      onClick={async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        const date = selectedDate?.toISODate();

                        if (!date) return;

                        await planMeals({
                          meals: [
                            {
                              recipe_id: recipe.id,
                              meal_time_id: mealTime.id,
                              planned_date: date,
                            },
                          ],
                          onSuccess() {
                            setIsOpen(false);
                          },
                        });

                        setOpenPlanPopover(false);
                      }}
                    >
                      {t(
                        `mealPlanning.dialog.filters.${mealTime.name}`,
                        mealTime.name,
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Popover.Arrow className="fill-base-100 stroke-base-300" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

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
