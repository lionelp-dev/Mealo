import { usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';

import { PlannedMeal } from '@/types';
import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import { MealTime, PlannedMealsSlot } from '../stores/week-meal-planner';
import { Button } from './ui/button';

type PageProps = {
  weekStart: string;
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
};

type MealPlanMealListProps = {
  plannedMealsSlots: PlannedMealsSlot[];
};

export default function MealPlanMealList({
  plannedMealsSlots,
}: MealPlanMealListProps) {
  const { weekStart, mealTimes, plannedMeals } = usePage<PageProps>().props;

  const currWeekStart = DateTime.fromISO(weekStart);

  const { unplanMeal } = useWeekPlannedMeals({
    weekStart: currWeekStart,
    mealTimes,
    plannedMeals,
  });

  return plannedMealsSlots.map(({ mealTime, plannedMeals }) => {
    return (
      <div
        key={mealTime.id}
        className="flex flex-col justify-between gap-5 py-2"
      >
        <span className="w-fit rounded-full bg-[#eceee9] px-3 py-1 text-xs text-gray-800">
          {mealTime.name}
        </span>
        {plannedMeals.map((plannedMeal) => {
          const { id, recipe } = plannedMeal;
          return (
            <div
              key={id}
              className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-base leading-tight text-gray-900">
                    {recipe.name}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      unplanMeal(plannedMeal.id);
                    }}
                  >
                    <Trash2
                      size={18}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}
