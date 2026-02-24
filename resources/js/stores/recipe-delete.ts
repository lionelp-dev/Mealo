import recipes from '@/routes/recipes';
import { Recipe } from '@/types';
import { router } from '@inertiajs/react';
import { create } from 'zustand';

export interface RecipeDeleteActions {
  openDeleteDialog: (recipes: Recipe[]) => void;
  closeDeleteDialog: () => void;
  deleteRecipes: () => Promise<void>;
  resetStore: () => void;
}

export interface RecipeDeleteState {
  recipesToDelete: Recipe[];
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
}

const initialState: RecipeDeleteState = {
  recipesToDelete: [],
  isDeleteDialogOpen: false,
  isDeleting: false,
};

export const useRecipeDeleteStore = create<
  RecipeDeleteState & RecipeDeleteActions
>((set, get) => ({
  ...initialState,

  openDeleteDialog: (recipesToDelete) =>
    set({
      recipesToDelete,
      isDeleteDialogOpen: true,
      isDeleting: false,
    }),

  closeDeleteDialog: () =>
    set({
      recipesToDelete: [],
      isDeleteDialogOpen: false,
      isDeleting: false,
    }),

  deleteRecipes: async () => {
    const { recipesToDelete } = get();

    if (recipesToDelete.length === 0) return;

    set({ isDeleting: true });

    try {
      const recipeIds = recipesToDelete.map((r) => r.id);
      router.delete(recipes.destroy.url(), {
        data: { recipe_ids: recipeIds },
        onSuccess: () => {
          set({
            recipesToDelete: [],
            isDeleteDialogOpen: false,
            isDeleting: false,
          });
        },
        onError: () => {
          set({ isDeleting: false });
        },
      });
    } catch {
      set({ isDeleting: false });
    }
  },

  resetStore: () => set(initialState),
}));
