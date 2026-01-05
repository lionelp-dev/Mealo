import { create } from 'zustand';

interface RecipeSearchState {
  searchTerm: string;
  isSearching: boolean;
}

interface RecipeSearchActions {
  setSearchTerm: (term: string) => void;
  setIsSearching: (isSearching: boolean) => void;

  reset: () => void;
}

const initialState: RecipeSearchState = {
  searchTerm: '',
  isSearching: false,
};

export const useRecipeSearchStore = create<
  RecipeSearchState & RecipeSearchActions
>((set) => ({
  ...initialState,

  setSearchTerm: (term) => set({ searchTerm: term }),

  setIsSearching: (isSearching) => set({ isSearching }),

  reset: () =>
    set({
      ...initialState,
    }),
}));
