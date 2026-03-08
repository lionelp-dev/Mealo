import { useRecipesRequestCoordination } from './use-recipes-request-coordination';
import { useRecipeSearchStore } from '@/stores/recipe-search';
import { useCallback, useEffect, useRef } from 'react';

export function useRecipeSearch() {
  const { triggerRecipesRequest } = useRecipesRequestCoordination();

  const { searchTerm, setSearchTerm, isSearching, setIsSearching } =
    useRecipeSearchStore();

  const performSearch = useCallback(
    () =>
      triggerRecipesRequest({
        onBefore: () => setIsSearching(true),
        onFinish: () => {
          setIsSearching(false);
          const searchInput = document.querySelector(
            'input[data-search-input]',
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            const len = searchInput.value.length;
            searchInput.setSelectionRange(len, len);
          }
        },
      }),
    [triggerRecipesRequest, setIsSearching],
  );

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, isSearching };
}
