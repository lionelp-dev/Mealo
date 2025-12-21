import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecipeSearchStore } from '../stores/recipe-search';

export default function MealPlanDialogSearchRecipes() {
  const { t } = useTranslation();
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    triggerSearch,
    setIsSearching,
  } = useRecipeSearchStore();

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
      triggerSearch({
        onBefore: () => setIsSearching(true),
        onFinish: () => {
          setIsSearching(false);
          setTimeout(() => {
            const searchInput = document.querySelector(
              'input[data-search-input]',
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              const len = searchTerm.length;
              searchInput.setSelectionRange(len, len);
            }
          }, 100);
        },
      });
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, triggerSearch]);

  return (
    <label className="input input-md flex w-full shrink-0">
      <Search className="text-base-content" size={18} />
      <input
        data-search-input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('mealPlanning.searchRecipes')}
        disabled={isSearching}
        className={` ${isSearching ? 'cursor-wait opacity-50' : ''}`}
      />
    </label>
  );
}
