import { cn } from '@/lib/utils';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function RecipesActiveFilters({
  className,
}: React.ComponentProps<'div'>) {
  const { t } = useTranslation();

  const { activeFilters, removeFilter } = useRecipeFiltersStore();

  if (activeFilters.length > 0) {
    return (
      <div className={cn('flex flex-nowrap gap-x-4 gap-y-3', className)}>
        {activeFilters.map((filter) => (
          <button
            key={`${filter.type}-${filter.value}`}
            onClick={() => removeFilter(filter)}
            className="badge flex cursor-pointer items-center gap-2 border-base-300 badge-xl text-sm whitespace-nowrap text-base-content transition-colors hover:border-error hover:bg-base-100 disabled:cursor-not-allowed disabled:opacity-50 [&:hover]:text-error"
          >
            <span>
              {filter.type === 'preparation_time' &&
                t('mealPlanning.dialog.filters.prep', 'Prep: ')}
              {filter.type === 'cooking_time' &&
                t('mealPlanning.dialog.filters.cook', 'Cook: ')}
              {filter.label}
            </span>
            <X size={14} />
          </button>
        ))}
      </div>
    );
  }
}
