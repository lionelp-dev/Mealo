import MealPlanEmptySlot from './meal-plan-empty-slot';
import MealPlanMealCard from './meal-plan-meal-card';
import { DayPlannedMeals } from '@/types';
import { ScrollArea } from '@radix-ui/themes';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

type MealPlanProps = {
  dayPlannedMeals: DayPlannedMeals;
};

export default function MealPlanSlots({ dayPlannedMeals }: MealPlanProps) {
  const { t } = useTranslation();

  const { date, plannedMealsSlots } = dayPlannedMeals;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-[60vh] w-full overflow-hidden rounded-xl border border-base-300/40 bg-base-100 pt-3.5 pb-2.5 shadow-xs">
      <div className="flex h-full w-full min-w-0 flex-1">
        <ScrollArea
          ref={scrollContainerRef}
          scrollbars="vertical"
          type="auto"
          className="!z-10 flex h-full w-full flex-col overflow-hidden px-2.5 [&>div>div]:!max-w-[100%]"
        >
          <div className="flex h-full w-full min-w-0 flex-col gap-3 border-base-300 bg-base-100">
            {plannedMealsSlots.length > 0 && (
              <div className="flex w-full min-w-0 flex-col gap-5 pt-1">
                {plannedMealsSlots.map(({ mealTime, plannedMeals }) => (
                  <div
                    key={mealTime.id}
                    className="flex w-full min-w-0 flex-col justify-between gap-[15px] px-1"
                  >
                    <span className="badge rounded-full badge-soft badge-outline border-secondary/15 badge-xs badge-secondary">
                      {t(
                        `mealPlanning.dialog.filters.${mealTime.name}`,
                        mealTime.name,
                      )}
                    </span>
                    {plannedMeals.map((plannedMeal) => (
                      <MealPlanMealCard
                        key={plannedMeal.id}
                        plannedMeal={plannedMeal}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            <MealPlanEmptySlot date={date} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
