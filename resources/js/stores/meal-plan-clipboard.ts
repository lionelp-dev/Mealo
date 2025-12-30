import { create } from 'zustand';
import { DayPlannedMeals } from '@/types';

export interface MealPlanClipboardState {
  copiedDayPlannedMeals: DayPlannedMeals | null;
}

export interface MealPlanClipboardActions {
  setCopiedDayPlannedMeals: (dayPlannedMeals: DayPlannedMeals | null) => void;
  clearCopiedDayPlannedMeals: () => void;
}

const initialState: MealPlanClipboardState = {
  copiedDayPlannedMeals: null,
};

export const useMealPlanClipboardStore = create<
  MealPlanClipboardState & MealPlanClipboardActions
>((set) => ({
  ...initialState,

  setCopiedDayPlannedMeals: (dayPlannedMeals) =>
    set({ copiedDayPlannedMeals: dayPlannedMeals }),

  clearCopiedDayPlannedMeals: () => set({ copiedDayPlannedMeals: null }),
}));