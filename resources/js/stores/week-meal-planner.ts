import { MealTime, PlannedMeal } from '../types';
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

export interface WeekPlannedMealsStoreState {
  copiedDayPlannedMeals: CopiedDayPlannedMeals | null;
}

export interface WeekPlannedMealsStoreActions {
  setCopiedDayPlannedMeals: (
    planned_meals: CopiedDayPlannedMeals | null,
  ) => void;
}

export const useWeekPlannedMealsStore = create<
  WeekPlannedMealsStoreState & WeekPlannedMealsStoreActions
>((set) => ({
  copiedDayPlannedMeals: null,

  setCopiedDayPlannedMeals: (copiedDayPlannedMeals) => {
    set({ copiedDayPlannedMeals: copiedDayPlannedMeals });
  },
}));
