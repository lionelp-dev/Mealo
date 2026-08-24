import { Filter } from '@/types';
import { create } from 'zustand';

interface RecipesFiltersState {
  mealTimeFilter: Filter | null;
  preparationTimeFilter: Filter | null;
  cookingTimeFilter: Filter | null;
  tagFilters: Filter[];
  activeFilters: Filter[];
}

const initialState: RecipesFiltersState = {
  mealTimeFilter: null,
  preparationTimeFilter: null,
  cookingTimeFilter: null,
  tagFilters: [],
  activeFilters: [],
};

interface RecipesFiltersActions {
  addFilter: (filter: Filter) => void;
  selectSingleFilter: (filter: Filter) => void;
  toggleTagFilter: (filter: Filter) => void;
  clearFilterType: (type: Filter['type']) => void;
  removeFilter: (filter: Filter) => void;
  clearAllFilters: () => void;
  isFilterActive: (filter: Pick<Filter, 'type' | 'value'>) => boolean;
}

function isSameFilter(
  currentFilter: Filter | null,
  filter: Pick<Filter, 'type' | 'value'>,
) {
  return (
    currentFilter?.type === filter.type && currentFilter.value === filter.value
  );
}

function buildActiveFilters(state: RecipesFiltersState): Filter[] {
  return [
    state.mealTimeFilter,
    state.preparationTimeFilter,
    state.cookingTimeFilter,
    ...state.tagFilters,
  ].filter((filter): filter is Filter => Boolean(filter));
}

export const useRecipesFiltersStore = create<
  RecipesFiltersState & RecipesFiltersActions
>((set, get) => ({
  ...initialState,

  addFilter: (filter) => {
    switch (filter.type) {
      case 'meal_time':
      case 'preparation_time':
      case 'cooking_time':
        get().selectSingleFilter(filter);
        return;

      case 'tag':
        set((state) => {
          const exists = state.tagFilters.some(
            (tagFilter) => tagFilter.value === filter.value,
          );

          if (exists) return state;

          const nextState = {
            ...state,
            tagFilters: [...state.tagFilters, filter],
          };

          return {
            tagFilters: nextState.tagFilters,
            activeFilters: buildActiveFilters(nextState),
          };
        });
        return;
    }
  },

  selectSingleFilter: (filter) => {
    set((state) => {
      const nextState = { ...state };

      switch (filter.type) {
        case 'meal_time':
          if (isSameFilter(state.mealTimeFilter, filter)) return state;
          nextState.mealTimeFilter = filter;
          break;

        case 'preparation_time':
          if (isSameFilter(state.preparationTimeFilter, filter)) return state;
          nextState.preparationTimeFilter = filter;
          break;

        case 'cooking_time':
          if (isSameFilter(state.cookingTimeFilter, filter)) return state;
          nextState.cookingTimeFilter = filter;
          break;

        case 'tag':
          return state;
      }

      return {
        mealTimeFilter: nextState.mealTimeFilter,
        preparationTimeFilter: nextState.preparationTimeFilter,
        cookingTimeFilter: nextState.cookingTimeFilter,
        activeFilters: buildActiveFilters(nextState),
      };
    });
  },

  toggleTagFilter: (filter) => {
    if (filter.type !== 'tag') return;

    set((state) => {
      const exists = state.tagFilters.some(
        (tagFilter) => tagFilter.value === filter.value,
      );

      const nextState = {
        ...state,
        tagFilters: exists
          ? state.tagFilters.filter(
              (tagFilter) => tagFilter.value !== filter.value,
            )
          : [...state.tagFilters, filter],
      };

      return {
        tagFilters: nextState.tagFilters,
        activeFilters: buildActiveFilters(nextState),
      };
    });
  },

  clearFilterType: (type) => {
    set((state) => {
      const nextState = { ...state };

      switch (type) {
        case 'meal_time':
          if (!state.mealTimeFilter) return state;
          nextState.mealTimeFilter = null;
          break;

        case 'preparation_time':
          if (!state.preparationTimeFilter) return state;
          nextState.preparationTimeFilter = null;
          break;

        case 'cooking_time':
          if (!state.cookingTimeFilter) return state;
          nextState.cookingTimeFilter = null;
          break;

        case 'tag':
          if (state.tagFilters.length === 0) return state;
          nextState.tagFilters = [];
          break;
      }

      return {
        mealTimeFilter: nextState.mealTimeFilter,
        preparationTimeFilter: nextState.preparationTimeFilter,
        cookingTimeFilter: nextState.cookingTimeFilter,
        tagFilters: nextState.tagFilters,
        activeFilters: buildActiveFilters(nextState),
      };
    });
  },

  removeFilter: (filter) => {
    set((state) => {
      const nextState = { ...state };

      switch (filter.type) {
        case 'meal_time':
          if (isSameFilter(state.mealTimeFilter, filter)) {
            nextState.mealTimeFilter = null;
          }
          break;

        case 'preparation_time':
          if (isSameFilter(state.preparationTimeFilter, filter)) {
            nextState.preparationTimeFilter = null;
          }
          break;

        case 'cooking_time':
          if (isSameFilter(state.cookingTimeFilter, filter)) {
            nextState.cookingTimeFilter = null;
          }
          break;

        case 'tag':
          nextState.tagFilters = state.tagFilters.filter(
            (tagFilter) => tagFilter.value !== filter.value,
          );
          break;
      }

      return {
        mealTimeFilter: nextState.mealTimeFilter,
        preparationTimeFilter: nextState.preparationTimeFilter,
        cookingTimeFilter: nextState.cookingTimeFilter,
        tagFilters: nextState.tagFilters,
        activeFilters: buildActiveFilters(nextState),
      };
    });
  },

  clearAllFilters: () => set({ ...initialState }),

  isFilterActive: (filter) => {
    switch (filter.type) {
      case 'meal_time':
        return isSameFilter(get().mealTimeFilter, filter);

      case 'preparation_time':
        return isSameFilter(get().preparationTimeFilter, filter);

      case 'cooking_time':
        return isSameFilter(get().cookingTimeFilter, filter);

      case 'tag':
        return get().tagFilters.some(
          (tagFilter) => tagFilter.value === filter.value,
        );
    }
  },
}));
