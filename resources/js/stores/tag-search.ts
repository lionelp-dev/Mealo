import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { create } from 'zustand';

interface TagSearchState {
  searchTerm: string;
  isSearching: boolean;
}

interface TagSearchActions {
  setSearchTerm: (term: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  triggerSearch: (callbacks?: {
    onBefore?: () => void;
    onFinish?: () => void;
  }) => void;
  reset: () => void;
}

const initialState: TagSearchState = {
  searchTerm: '',
  isSearching: false,
};

export const useTagSearchStore = create<TagSearchState & TagSearchActions>(
  (set, get) => ({
    ...initialState,

    setSearchTerm: (term) => set({ searchTerm: term }),

    setIsSearching: (isSearching) => set({ isSearching }),

    triggerSearch: (callbacks = {}) => {
      const { onBefore, onFinish } = callbacks;
      const { searchTerm } = get();

      const params: { tags_search?: string } = {};
      params.tags_search = searchTerm;
      router.visit(recipes.create.url(), {
        data: params,
        preserveUrl: false,
        preserveState: true,
        only: ['tags_search_results'],
        reset: ['tags_search_results'],
        replace: true,
        onBefore,
        onFinish,
      });
    },

    reset: () => set(initialState),
  }),
);
