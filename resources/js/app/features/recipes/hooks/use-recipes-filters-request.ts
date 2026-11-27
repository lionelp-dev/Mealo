import { useRecipesRequestCoordination } from '@/app/hooks/use-recipes-request-coordination';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { useEffect, useRef } from 'react';

export function useRecipesFiltersRequest() {
  const activeFilters = useRecipesFiltersStore((state) => state.activeFilters);
  const { triggerRecipesRequest } = useRecipesRequestCoordination();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    triggerRecipesRequest();
  }, [activeFilters, triggerRecipesRequest]);
}
