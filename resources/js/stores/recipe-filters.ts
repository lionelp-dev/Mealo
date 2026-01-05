import { Filter } from '@/types';
import { create } from 'zustand';

interface RecipeFiltersState {
  activeFilters: Filter[];
}

interface RecipeFiltersActions {
  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  clearAllFilters: () => void;
  isFilterActive: (filter: Pick<Filter, 'type' | 'value'>) => boolean;
  toggleFilter: (filter: Filter) => void;
}

const initialState: RecipeFiltersState = {
  activeFilters: [],
};

export const useRecipeFiltersStore = create<
  RecipeFiltersState & RecipeFiltersActions
>((set, get) => ({
  ...initialState,

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
  },

  removeFilter: (filter) => {
    const newFilters = get().activeFilters.filter(
      (f) => !(f.type === filter.type && f.value === filter.value),
    );
    set({ activeFilters: newFilters });
  },

  clearAllFilters: () => set({ ...initialState }),

  isFilterActive: (filter) => {
    const state = get();
    return state.activeFilters.some(
      (f) => f.type === filter.type && f.value === filter.value,
    );
  },

  toggleFilter(filter) {
    if (get().isFilterActive(filter)) return get().removeFilter(filter);
    get().addFilter(filter);
  },
}));
