import { useRecipeSearch } from '@/hooks/use-recipes-search';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MealPlanDialogSearchRecipes() {
  const { t } = useTranslation();

  const { searchTerm, setSearchTerm, isSearching } = useRecipeSearch();

  return (
    <label className="input col-start-1 col-end-3 input-md flex w-full gap-3 border-secondary/50 input-secondary">
      <Search
        className={`mb-[2px] text-secondary transition-transform duration-300`}
        size={16}
      />
      <input
        data-search-input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('mealPlanning.searchRecipes', 'Search recipes...')}
        disabled={isSearching}
      />
      <span
        className={cn(
          'loading loading-sm loading-spinner text-secondary opacity-0',
          isSearching && 'opacity-100',
        )}
      ></span>
    </label>
  );
}
