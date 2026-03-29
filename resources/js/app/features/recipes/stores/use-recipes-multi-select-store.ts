import { create } from 'zustand';

export interface RecipesMultiSelectState {
  selectedRecipeIds: string[];
  isMultiSelectMode: boolean;
}

const initialState: RecipesMultiSelectState = {
  selectedRecipeIds: [],
  isMultiSelectMode: false,
};
export interface RecipesMultiSelectActions {
  setIsMultiSelectMode: (value: boolean) => void;
  toggleRecipeSelection: (recipeId: string) => void;
  clearSelectedRecipes: () => void;
  resetStore: () => void;
}

export const useRecipesMultiSelectStore = create<
  RecipesMultiSelectState & RecipesMultiSelectActions
>((set) => ({
  ...initialState,

  setIsMultiSelectMode: (value) =>
    set((state) => ({
      isMultiSelectMode: value,
      selectedRecipeIds: value ? state.selectedRecipeIds : [],
    })),

  toggleRecipeSelection: (recipeId) =>
    set((state) => {
      const isSelected = state.selectedRecipeIds.some((r) => r === recipeId);

      if (isSelected) {
        return {
          selectedRecipeIds: state.selectedRecipeIds.filter(
            (r) => r !== recipeId,
          ),
        };
      } else {
        return {
          selectedRecipeIds: [...state.selectedRecipeIds, recipeId],
        };
      }
    }),

  clearSelectedRecipes: () => set({ selectedRecipeIds: [] }),
  resetStore: () => set(initialState),
}));
