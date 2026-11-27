import { Typography } from '@/app/components/Typography';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { capitalize } from '@/app/utils';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ActiveRecipeFilters() {
  const { t } = useTranslation();
  const activeFilters = useRecipesFiltersStore((state) => state.activeFilters);
  const clearAllFilters = useRecipesFiltersStore(
    (state) => state.clearAllFilters,
  );
  const removeFilter = useRecipesFiltersStore((state) => state.removeFilter);

  if (activeFilters.length === 0) return null;

  return (
    <div className="col-span-2 flex min-w-0 items-center justify-between gap-3">
      <div className="flex max-h-[4.5rem] min-w-0 flex-wrap content-start items-center gap-2 overflow-hidden">
        {activeFilters.map((filter) => (
          <button
            key={`${filter.type}-${filter.value}`}
            type="button"
            onClick={() => removeFilter(filter)}
            className="badge h-8 max-w-40 gap-1.5 border-0 bg-secondary/10 px-3 text-sm font-normal text-secondary"
          >
            <Typography
              as="span"
              variant="body-sm"
              tone="inherit"
              className="truncate"
            >
              {filter.type === 'preparation_time' &&
                t('mealPlanning.dialog.filters.prep', 'Prep: ')}
              {filter.type === 'cooking_time' &&
                t('mealPlanning.dialog.filters.cook', 'Cook: ')}
              {filter.type === 'meal_time'
                ? capitalize(
                    t(
                      `mealPlanning.dialog.filters.${filter.label}`,
                      filter.label,
                    ),
                  )
                : capitalize(filter.label)}
            </Typography>
            <X size={14} className="shrink-0" aria-hidden="true" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={clearAllFilters}
        className="btn h-fit shrink-0 p-0 text-secondary btn-link"
      >
        {t('recipes.index.clearFilters', 'Clear filters')}
      </button>
    </div>
  );
}
