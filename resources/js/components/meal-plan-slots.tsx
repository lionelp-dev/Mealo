import { useRef } from 'react';

import { DayPlannedMeals } from '@/types';
import { useTranslation } from 'react-i18next';
import MealPlanEmptySlot from './meal-plan-empty-slot';
import MealPlanMealCard from './meal-plan-meal-card';

type MealPlanProps = {
  dayPlannedMeals: DayPlannedMeals;
};

export default function MealPlanSlots({ dayPlannedMeals }: MealPlanProps) {
  const { t } = useTranslation();

  const { date, plannedMealsSlots } = dayPlannedMeals;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-[60vh] rounded-lg border border-base-300 bg-base-100 pt-5 pb-4 shadow-sm">
      <div
        ref={scrollContainerRef}
        className="flex h-full w-full flex-col gap-4 overflow-y-scroll px-4"
      >
        <div className="flex h-full flex-col gap-2.5">
          <div className="flex flex-1 flex-col gap-3 rounded-lg border-base-300 bg-base-100">
            {plannedMealsSlots.length > 0 &&
              plannedMealsSlots.map(({ mealTime, plannedMeals }) => (
                <div
                  key={mealTime.id}
                  className="flex flex-col justify-between gap-5 py-2"
                >
                  <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs text-secondary-content">
                    {t(`mealPlanning.dialog.filters.${mealTime.name}`)}
                  </span>
                  {plannedMeals.map((plannedMeal) => (
                    <MealPlanMealCard plannedMeal={plannedMeal} />
                  ))}
                </div>
              ))}
            <MealPlanEmptySlot containerRef={scrollContainerRef} date={date} />
          </div>
        </div>
      </div>
    </div>
  );
}
