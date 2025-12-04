import { usePage } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';

import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import MealPlanDayHeader from './meal-plan-day-header';
import MealPlanDialog from './meal-plan-dialog';
import MealPlanSlots from './meal-plan-slots';

import { MealTime, PlannedMeal } from '@/types';

type PageProps = {
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
  weekStart: string;
};

export default function MealPlanCalendar() {
  const today = DateTime.now();

  const { weekStart, mealTimes, plannedMeals } = usePage<PageProps>().props;

  const currWeekStart = DateTime.fromISO(weekStart);

  const { weekPlannedMeals } = useWeekPlannedMeals({
    weekStart: currWeekStart,
    mealTimes,
    plannedMeals,
  });

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
    <div className="grid grid-cols-1 gap-x-5 gap-y-0 pb-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {weekPlannedMeals.map((dayPlannedMeals) => {
        const { date } = dayPlannedMeals;
        const isToday = date.hasSame(today, 'day');
        return (
          <div
            key={date.toISODate()}
            ref={isToday ? currentDayRef : null}
            className="flex flex-col gap-4 pt-4"
          >
            <MealPlanDayHeader dayPlannedMeals={dayPlannedMeals} />
            <MealPlanSlots dayPlannedMeals={dayPlannedMeals} />
          </div>
        );
      })}
      <MealPlanDialog />
    </div>
  );
}
