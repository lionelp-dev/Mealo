import { useRecipeMultiSelectStore } from '@/stores/recipe-multi-select';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function useMultiSelectRecipe() {
  const store = useRecipeMultiSelectStore();
  const { url } = usePage();

  // Reset automatique quand l'URL change
  useEffect(() => {
    return () => {
      // Cleanup au unmount du composant
      store.resetStore();
    };
  }, [url]);

  return store;
}
