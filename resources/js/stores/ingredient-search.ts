import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { create } from 'zustand';

interface IngredientSearchState {
  searchTerm: string;
  isSearching: boolean;
}

interface IngredientSearchActions {
  setSearchTerm: (term: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  triggerSearch: (callbacks?: {
    onBefore?: () => void;
    onFinish?: () => void;
  }) => void;
  reset: () => void;
}

const initialState: IngredientSearchState = {
  searchTerm: '',
  isSearching: false,
};

export const useIngredientSearchStore = create<
  IngredientSearchState & IngredientSearchActions
>((set, get) => ({
  ...initialState,

  setSearchTerm: (term) => set({ searchTerm: term }),

  setIsSearching: (isSearching) => set({ isSearching }),

  triggerSearch: (callbacks = {}) => {
    const { onBefore, onFinish } = callbacks;
    const { searchTerm } = get();

    const params: { ingredients_search?: string } = {};
    params.ingredients_search = searchTerm;
    router.visit(recipes.create.url(), {
      data: params,
      preserveUrl: false,
      preserveState: true,
      only: ['ingredients_search_results'],
      reset: ['ingredients_search_results'],
      replace: true,
      onBefore,
      onFinish,
    });
  },

  reset: () => set(initialState),
}));
