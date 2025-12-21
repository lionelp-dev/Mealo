import { DateTime } from 'luxon';
import { create } from 'zustand';

export interface MealPlanDialogControllerActions {
  setIsOpen: (value: boolean) => void;
  openMealPlanDialog: (date: DateTime, mealTimeId?: number) => void;
  closeDialog: () => void;
  setSelectedMealTimeId: (value: number) => void;
  toggleRecipeSelection: (recipeId: number) => void;
  clearSelectedRecipes: () => void;
  resetState: () => void;
}

export interface MealPlanDialogState {
  isOpen: boolean;
  selectedDate: DateTime | undefined;
  selectedMealTimeId: number | undefined;
  selectedRecipesId: number[];
}

const initialState: MealPlanDialogState = {
  isOpen: false,
  selectedDate: undefined,
  selectedMealTimeId: undefined,
  selectedRecipesId: [],
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

  toggleRecipeSelection: (recipeId) =>
    set((state) => {
      const isSelected = state.selectedRecipesId.some((r) => r === recipeId);
      return {
        selectedRecipesId: isSelected
          ? state.selectedRecipesId.filter((r) => r !== recipeId)
          : [...state.selectedRecipesId, recipeId],
      };
    }),

  clearSelectedRecipes: () => set({ selectedRecipesId: [] }),

  resetState: () => set(initialState),
}));
