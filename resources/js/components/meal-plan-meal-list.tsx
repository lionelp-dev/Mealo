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
              className="rounded-md border border-base-300 bg-base-100 px-5 py-5 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-base-content">{recipe.name}</span>
                  <button
                    className="btn btn-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      unplanMeal(plannedMeal.id);
                    }}
                  >
                    <Trash2
                      size={18}
                      className="text-base-content hover:text-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}
