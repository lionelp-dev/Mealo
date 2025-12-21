import { useRef } from 'react';

import { DayPlannedMeals } from '../stores/week-meal-planner';
import MealPlanEmptySlot from './meal-plan-empty-slot';
import MealPlanMealList from './meal-plan-meal-list';

type MealPlanProps = {
  dayPlannedMeals: DayPlannedMeals;
};

export default function MealPlanSlots({ dayPlannedMeals }: MealPlanProps) {
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
            <MealPlanMealList plannedMealsSlots={plannedMealsSlots} />
            <MealPlanEmptySlot containerRef={scrollContainerRef} date={date} />
          </div>
        </div>
      </div>
    </div>
  );
}
