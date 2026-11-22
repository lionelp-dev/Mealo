import { Typography } from '@/app/components/Typography';
import { useRecipesSearch } from '@/app/hooks/use-recipes-search';
import { cn } from '@/app/lib/';
import { ClassValue } from 'clsx';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  className?: ClassValue;
};

export default function RecipesSearch({ className }: Props) {
  const { t } = useTranslation();

  const { searchTerm, setSearchTerm, isSearching } = useRecipesSearch();

  return (
    <Typography
      as="label"
      variant="label"
      className={cn(
        'input input-md flex w-full gap-3 rounded-xl border-secondary/40 input-secondary',
        className,
      )}
    >
      <Search
        className={`text-secondary transition-transform duration-300`}
        size={16}
      />
      <Typography tone="secondary">
        <input
          data-search-input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('mealPlanning.searchRecipes', 'Search recipes...')}
          className="pb-[2px]"
        />
      </Typography>
      <span
        className={cn(
          'loading loading-sm loading-spinner text-secondary opacity-0',
          isSearching && 'opacity-100',
        )}
      ></span>
    </Typography>
  );
}
