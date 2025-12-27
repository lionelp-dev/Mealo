import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';

import { useWeekPlannedMeals } from '@/hooks/use-week-planned-meals';
import { InfiniteScroll } from '@inertiajs/react';
import { useMealPlanData } from '../hooks/use-meal-plan-data';
import MealPlanDayHeader from './meal-plan-day-header';
import MealPlanDialog from './meal-plan-dialog';
import MealPlanDialogRecipes from './meal-plan-dialog-recipes';
import MealPlanSlots from './meal-plan-slots';

export default function MealPlanCalendar() {
  const { weekPlannedMeals } = useMealPlanData();

  const { isOpen } = useWeekPlannedMeals();

  const today = DateTime.now();
  const currentDayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (currentDayRef.current) {
        currentDayRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(22.5rem,1fr))] gap-x-6 gap-y-6">
      {weekPlannedMeals.map((dayPlannedMeals) => {
        const { date } = dayPlannedMeals;
        const isToday = date.hasSame(today, 'day');
        return (
          <div
            key={date.toISODate()}
            ref={isToday ? currentDayRef : null}
            className="flex flex-col gap-5"
          >
            <MealPlanDayHeader dayPlannedMeals={dayPlannedMeals} />
            <MealPlanSlots dayPlannedMeals={dayPlannedMeals} />
          </div>
        );
      })}
      <MealPlanDialog open={isOpen}>
        <div className="overflow-y-scroll">
          <InfiniteScroll data="recipes">
            <MealPlanDialogRecipes />
          </InfiniteScroll>
        </div>
      </MealPlanDialog>
    </div>
  );
}
