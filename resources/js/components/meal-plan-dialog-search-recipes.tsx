import { useRecipeSearchStore } from '@/stores/recipe-search';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
    <div className="relative flex items-center">
      <Search className="absolute left-5 z-10 text-gray-400" size={18} />
      <input
        data-search-input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('mealPlanning.searchRecipes')}
        disabled={isSearching}
        className={`w-full rounded-lg border-2 border-gray-200 py-2.5 pr-4 pl-12 text-base hover:border-gray-300 focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none ${
          isSearching ? 'cursor-wait opacity-50' : ''
        }`}
      />
      {isSearching && (
        <div className="absolute right-3 text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
        </div>
      )}
    </div>
  );
}
