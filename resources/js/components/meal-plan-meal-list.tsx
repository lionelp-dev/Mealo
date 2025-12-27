import { Trash2 } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import { PlannedMealsSlot } from '../stores/week-meal-planner';

interface MealPlanMealListProps {
  plannedMealsSlots: PlannedMealsSlot[];
}

export default function MealPlanMealList({
  plannedMealsSlots,
}: MealPlanMealListProps) {
  const { t } = useTranslation();

  const { unplanMeal } = useWeekPlannedMeals();

  return plannedMealsSlots.map(({ mealTime, plannedMeals }) => {
    if (plannedMeals.length === 0) return;
    return (
      <div
        key={mealTime.id}
        className="flex flex-col justify-between gap-5 py-2"
      >
        <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs text-secondary-content">
          {t(`mealPlanning.dialog.filters.${mealTime.name}`)}
        </span>
        {plannedMeals.map((plannedMeal) => {
          const { id, recipe } = plannedMeal;
          return (
            <div
              key={id}
              className="card border border-base-300 bg-base-100 shadow-sm card-xs hover:shadow-md"
            >
              <div className="flex flex-1 flex-col">
                <div className="relative">
                  {recipe.image_url && (
                    <>
                      <figure className="h-28">
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="h-full w-full object-cover"
                        />
                      </figure>
                      <button
                        className="btn absolute top-0 right-0 left-0 mx-2 my-3 flex justify-end gap-2 text-sm text-base-content/60 btn-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          unplanMeal(plannedMeal.id);
                        }}
                      >
                        <Trash2
                          size={18}
                          className="text-error/80 hover:text-error"
                        />
                      </button>
                    </>
                  )}
                </div>

                <div className="card-body">
                  <div className="flex items-center">
                    <span className="card-title px-3 py-3 text-base-content">
                      {recipe.name}
                    </span>
                    {!recipe.image_url && (
                      <button
                        className="btn flex justify-end gap-2 text-sm text-base-content/60 btn-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          unplanMeal(plannedMeal.id);
                        }}
                      >
                        <Trash2
                          size={18}
                          className="text-error/80 hover:text-error"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}
