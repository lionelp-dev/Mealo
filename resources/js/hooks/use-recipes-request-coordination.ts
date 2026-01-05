import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useRecipeFiltersStore } from '../stores/recipe-filters';
import { useRecipeSearchStore } from '../stores/recipe-search';

export function useRecipesRequestCoordination() {
  const { activeFilters, clearAllFilters } = useRecipeFiltersStore();
  const { searchTerm, reset: resetRecipeSearch } = useRecipeSearchStore();

  const { url } = usePage();

  const baseUrl = new URL(url, window.location.origin).pathname;

  useEffect(() => {
    return () => {
      clearAllFilters();
      resetRecipeSearch();
    };
  }, [baseUrl]);

  const buildSearchParams = () => {
    const params: {
      search?: string;
      meal_times?: string[];
      tags?: string[];
      preparation_time?: string;
      cooking_time?: string;
    } = {};

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
      {} as Record<string, string[]>,
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

    return params;
  };

  const triggerRecipesRequest = (
    callbacks: {
      onBefore?: () => void;
      onFinish?: () => void;
    } = {},
  ) => {
    const { onBefore, onFinish } = callbacks;

    const params = buildSearchParams();

    router.visit(baseUrl, {
      data: params,
      method: 'get',
      preserveUrl: false,
      preserveState: true,
      only: ['recipes'],
      reset: ['recipes'],
      replace: true,
      onBefore,
      onFinish,
    });
  };

  return { triggerRecipesRequest };
}
