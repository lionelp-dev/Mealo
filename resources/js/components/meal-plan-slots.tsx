import { useRef } from 'react';

import { DayPlannedMeals } from '@/types';
import { ScrollArea } from '@radix-ui/themes';
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
    <div className="h-[60vh] rounded-lg border border-base-300/55 bg-base-100 py-4 shadow-xs">
      <ScrollArea
        ref={scrollContainerRef}
        scrollbars="vertical"
        type="auto"
        className="!z-10 flex h-full w-full flex-col overflow-y-auto px-3.5"
      >
        <div className="flex h-full flex-col border-base-300 bg-base-100">
          {plannedMealsSlots.length > 0 && (
            <div className="pt-[2px]">
              {plannedMealsSlots.map(({ mealTime, plannedMeals }) => (
                <div
                  key={mealTime.id}
                  className="flex flex-col justify-between gap-3.5 pb-6"
                >
                  <span className="badge rounded-full badge-soft badge-outline border-secondary/40 badge-sm text-secondary badge-secondary">
                    {t(
                      `mealPlanning.dialog.filters.${mealTime.name}`,
                      mealTime.name,
                    )}
                  </span>
                  {plannedMeals.map((plannedMeal) => (
                    <MealPlanMealCard plannedMeal={plannedMeal} />
                  ))}
                </div>
              ))}
            </div>
          )}
          <MealPlanEmptySlot containerRef={scrollContainerRef} date={date} />
        </div>
      </ScrollArea>
    </div>
  );
}
