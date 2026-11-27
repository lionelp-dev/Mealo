import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { useEffect } from 'react';

export function useResetRecipesMultiSelectOnNavigation(url: string) {
  useEffect(() => {
    return () => useRecipesMultiSelectStore.getState().resetStore();
  }, [url]);
}
