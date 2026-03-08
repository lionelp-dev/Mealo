import { create } from 'zustand';

interface RecipesSearchState {
  searchTerm: string;
  isSearching: boolean;
}

interface RecipesSearchActions {
  setSearchTerm: (term: string) => void;
  setIsSearching: (isSearching: boolean) => void;

  reset: () => void;
}

const initialState: RecipesSearchState = {
  searchTerm: '',
  isSearching: false,
};

export const useRecipesSearchStore = create<
  RecipesSearchState & RecipesSearchActions
>((set) => ({
  ...initialState,

  setSearchTerm: (term) => set({ searchTerm: term }),

  setIsSearching: (isSearching) => set({ isSearching }),

  reset: () =>
    set({
      ...initialState,
    }),
}));
