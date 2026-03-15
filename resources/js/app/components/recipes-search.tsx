import { useRecipesSearch } from '@/app/hooks/use-recipes-search';
import { cn } from '@/app/lib/';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RecipesSearch() {
  const { t } = useTranslation();

  const { searchTerm, setSearchTerm, isSearching } = useRecipesSearch();

  return (
    <label className="input input-md flex w-full gap-3 rounded-xl border-secondary input-secondary">
      <Search
        className={`text-secondary transition-transform duration-300`}
        size={16}
      />
      <input
        data-search-input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('mealPlanning.searchRecipes', 'Search recipes...')}
        className="pb-[2px]"
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
