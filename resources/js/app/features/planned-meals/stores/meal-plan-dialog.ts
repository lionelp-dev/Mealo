import { DateTime } from 'luxon';
import { create } from 'zustand';

export interface MealPlanDialogControllerActions {
  setIsOpen: (value: boolean) => void;
  openMealPlanDialog: (date: DateTime, mealTimeId?: number) => void;
  closeDialog: () => void;
  setSelectedMealTimeId: (value: number) => void;
  resetState: () => void;
}

export interface MealPlanDialogState {
  isOpen: boolean;
  selectedDate: DateTime | undefined;
  selectedMealTimeId: number | undefined;
}

const initialState: MealPlanDialogState = {
  isOpen: false,
  selectedDate: undefined,
  selectedMealTimeId: undefined,
};

export const useMealPlanDialogStore = create<
  MealPlanDialogState & MealPlanDialogControllerActions
>((set) => ({
  ...initialState,

  setIsOpen: (value) => set({ isOpen: value }),

  openMealPlanDialog: (date) =>
    set({
      isOpen: true,
      selectedDate: date,
    }),

  closeDialog: () => set(initialState),

  setSelectedMealTimeId: (value) => set({ selectedMealTimeId: value }),

  resetState: () => set(initialState),
}));
