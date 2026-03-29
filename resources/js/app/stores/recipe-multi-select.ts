import { create } from 'zustand';

export interface RecipeMultiSelectActions {
  setIsMultiSelectMode: (value: boolean) => void;
  toggleRecipeSelection: (recipeId: string) => void;
  clearSelectedRecipes: () => void;
  resetStore: () => void;
}

export interface RecipeMultiSelectState {
  selectedRecipesId: string[];
  isMultiSelectMode: boolean;
}

const initialState: RecipeMultiSelectState = {
  selectedRecipesId: [],
  isMultiSelectMode: false,
};

export const useRecipeMultiSelectStore = create<
  RecipeMultiSelectState & RecipeMultiSelectActions
>((set) => ({
  ...initialState,

  setIsMultiSelectMode: (value) =>
    set((state) => ({
      isMultiSelectMode: value,
      // Clear selections when disabling multi-select mode
      selectedRecipesId: value ? state.selectedRecipesId : [],
    })),

  toggleRecipeSelection: (recipeId) =>
    set((state) => {
      const isSelected = state.selectedRecipesId.some((r) => r === recipeId);

      if (isSelected) {
        return {
          selectedRecipesId: state.selectedRecipesId.filter(
            (r) => r !== recipeId,
          ),
        };
      } else {
        return {
          selectedRecipesId: [...state.selectedRecipesId, recipeId],
        };
      }
    }),

  clearSelectedRecipes: () => set({ selectedRecipesId: [] }),

  resetStore: () => set(initialState),
}));
