import { router } from '@inertiajs/react';
import { create } from 'zustand';

export type FilterType =
  | 'meal_time'
  | 'preparation_time'
  | 'cooking_time'
  | 'tag';

export type Filter = {
  type: FilterType;
  value: string;
  label: string;
};

export type SearchParams = {
  search?: string;
  meal_times?: string[];
  tags?: string[];
  preparation_time?: string;
  cooking_time?: string;
};

interface RecipeSearchState {
  searchTerm: string;
  activeFilters: Filter[];
  isSearching: boolean;
  searchParams: SearchParams;
}

interface RecipeSearchActions {
  setSearchTerm: (term: string) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  clearFilters: () => void;
  setIsSearching: (isSearching: boolean) => void;
  updateSearchParams: () => void;
  triggerSearch: (callbacks?: {
    onBefore?: () => void;
    onFinish?: () => void;
  }) => void;
  reset: () => void;
}

const initialState: RecipeSearchState = {
  searchTerm: '',
  activeFilters: [],
  isSearching: false,
  searchParams: {},
};

export const useRecipeSearchStore = create<
  RecipeSearchState & RecipeSearchActions
>((set, get) => ({
  ...initialState,
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().updateSearchParams();
  },

  addFilter: (filter) => {
    const state = get();

    let newFilters = [...state.activeFilters];
    if (filter.type === 'preparation_time' || filter.type === 'cooking_time') {
      newFilters = newFilters.filter((f) => f.type !== filter.type);
    }

    const exists = newFilters.some(
      (f) => f.type === filter.type && f.value === filter.value,
    );
    if (!exists) {
      newFilters.push(filter);
    }

    set({ activeFilters: newFilters });
    get().updateSearchParams();
    get().triggerSearch();
  },

  removeFilter: (filter) => {
    const newFilters = get().activeFilters.filter(
      (f) => !(f.type === filter.type && f.value === filter.value),
    );
    set({ activeFilters: newFilters });
    get().updateSearchParams();
    get().triggerSearch();
  },

  clearFilters: () => {
    set({ activeFilters: [] });
    get().updateSearchParams();
    get().triggerSearch();
  },

  setIsSearching: (isSearching) => set({ isSearching }),

  updateSearchParams: () => {
    const { searchTerm, activeFilters } = get();
    const params: SearchParams = {};

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const filtersByType = activeFilters.reduce(
      (acc, filter) => {
        if (!acc[filter.type]) {
          acc[filter.type] = [];
        }
        acc[filter.type].push(filter.value);
        return acc;
      },
      {} as Record<FilterType, string[]>,
    );

    if (filtersByType.meal_time?.length > 0) {
      params.meal_times = filtersByType.meal_time;
    }
    if (filtersByType.tag?.length > 0) {
      params.tags = filtersByType.tag;
    }
    if (filtersByType.preparation_time?.[0]) {
      params.preparation_time = filtersByType.preparation_time[0];
    }
    if (filtersByType.cooking_time?.[0]) {
      params.cooking_time = filtersByType.cooking_time[0];
    }

    set({ searchParams: params });
  },

  triggerSearch: (callbacks = {}) => {
    const { onBefore, onFinish } = callbacks;
    const { searchParams } = get();

    router.visit('/planned-meals', {
      data: searchParams,
      method: 'get',
      preserveUrl: false,
      preserveState: true,
      only: ['recipes'],
      reset: ['recipes'],
      replace: true,
      onBefore,
      onFinish,
    });
  },

  reset: () =>
    set({
      ...initialState,
    }),
}));
