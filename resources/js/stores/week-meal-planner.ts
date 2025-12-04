import { MealTime, PlannedMeal } from '@/types';
import { DateTime } from 'luxon';
import { create } from 'zustand';

export type PlannedMealsSlot = {
  mealTime: MealTime;
  plannedMeals: PlannedMeal[];
};

export type DayPlannedMeals = {
  date: DateTime;
  plannedMealsSlots: PlannedMealsSlot[];
};

export type CopiedMealSlot = {
  recipe_id: number;
  meal_time_id: number;
  planned_date: string;
};

export type CopiedDayPlannedMeals = {
  planned_meals: CopiedMealSlot[];
};

export type SetDayPlannedMealsProps = {
  weekStart: DateTime;
  mealTimes: MealTime[];
  plannedMeals: PlannedMeal[];
};

export interface WeekPlannedMealsStoreState {
  weekPlannedMeals: DayPlannedMeals[];
  copiedDayPlannedMeals: CopiedDayPlannedMeals | null;
}

export interface WeekPlannedMealsStoreActions {
  setWeekPlannedMeals: ({
    weekStart,
    mealTimes,
    plannedMeals,
  }: SetDayPlannedMealsProps) => void;
  setCopiedDayPlannedMeals: (
    planned_meals: CopiedDayPlannedMeals | null,
  ) => void;
}

export const useWeekPlannedMealsStore = create<
  WeekPlannedMealsStoreState & WeekPlannedMealsStoreActions
>((set) => ({
  weekPlannedMeals: [],
  copiedDayPlannedMeals: null,

  setWeekPlannedMeals: ({ weekStart, plannedMeals, mealTimes }) => {
    const weekPlannedMeals = Array.from({ length: 7 }, (_, index) => {
      const date = weekStart.plus({ day: index });
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
                (plannedMeal) => plannedMeal.meal_time_id === mealTime.id,
              ),
          }))
          .filter((slot) => slot.plannedMeals.length !== 0)
          .sort((a, b) => a.mealTime.id - b.mealTime.id),
      };
    });
    set({ weekPlannedMeals });
  },

  setCopiedDayPlannedMeals: (copiedDayPlannedMeals) => {
    set({ copiedDayPlannedMeals: copiedDayPlannedMeals });
  },
}));
