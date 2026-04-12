import { usePlannedMealsContextValue } from '../inertia.adapter';
import { DayPlannedMeals } from '@/types';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export function useWeekPlannedMeals() {
  const { weekStart, mealTimes, plannedMeals } = usePlannedMealsContextValue();

  const currWeekStart = DateTime.fromISO(weekStart);

  const weekPlannedMeals = useMemo<DayPlannedMeals[]>(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = currWeekStart.plus({ day: index });
      return {
        date: date,
        plannedMealsSlots: mealTimes
          .map((mealTime) => ({
            mealTime,
            plannedMeals: (Array.isArray(plannedMeals) ? plannedMeals : [])
              .filter((plannedMeal) =>
                DateTime.fromISO(plannedMeal.planned_date).hasSame(date, 'day'),
              )
              .filter(
                (plannedMeal) =>
                  plannedMeal.meal_time_id === Number(mealTime.id),
              ),
          }))
          .filter((slot) => slot.plannedMeals.length !== 0)
          .sort((a, b) => a.mealTime.id - b.mealTime.id),
      };
    });
  }, [currWeekStart, mealTimes, plannedMeals]);
  return {
    weekPlannedMeals,
  };
}
