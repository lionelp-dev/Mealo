import { capitalize, cn } from '@/lib/utils';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { Filter, FilterSection, Option } from '@/types';
import { FilterIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RecipeFiltersPopover } from './recipes-popover-filters';

enum MealTimeEnum {
  BREAKFAST = '1',
  LUNCH = '2',
  DINNER = '3',
  SNACK = '4',
}

const FILTERS_SECTIONS: FilterSection[] = [
  {
    title: 'mealTime',
    type: 'meal_time',
    options: [
      {
        label: 'breakfast',
        value: MealTimeEnum.BREAKFAST,
      },
      {
        label: 'lunch',
        value: MealTimeEnum.LUNCH,
      },
      {
        label: 'dinner',
        value: MealTimeEnum.DINNER,
      },
      {
        label: 'snack',
        value: MealTimeEnum.SNACK,
      },
    ] as Option[],
  },
];

export function RecipeFilters({ className }: React.ComponentProps<'div'>) {
  const { t } = useTranslation();

  const {
    activeFilters,
    isFilterActive,
    toggleFilter,
    removeFilter,
    clearAllFilters,
  } = useRecipeFiltersStore();

  return (
    <div className={cn('flex flex-1 flex-col flex-wrap', className)}>
      <div className="flex max-w-full items-center gap-3.5 rounded-xl">
        <div className="flex flex-1 flex-wrap gap-2.5">
          {FILTERS_SECTIONS.map((section) =>
            section.options.map((option, key) => {
              const filter: Filter = {
                type: section.type,
                value: option.value,
                label: option.label,
              };
              const isActive = isFilterActive(filter);
              return (
                <label
                  className={cn(
                    `group/item btn flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg text-sm font-normal whitespace-nowrap transition-colors btn-outline btn-sm btn-secondary select-none`,
                    isActive && 'bg-secondary text-secondary-content',
                  )}
                  htmlFor={key.toString()}
                >
                  <span className="pb-[2px]">
                    {capitalize(
                      t(
                        `mealPlanning.dialog.filters.${filter.label}`,
                        filter.label,
                      ),
                    )}
                  </span>
                  <input
                    id={key.toString()}
                    type="checkbox"
                    checked={isActive}
                    onClick={() => toggleFilter(filter)}
                    className="radio flex-shrink-0 rounded-full checkbox-xs radio-secondary group-hover/item:border-2 group-hover/item:border-white"
                  />
                </label>
              );
            }),
          )}
          {activeFilters.length > 0 &&
            activeFilters.map(
              (filter) =>
                filter.type !== 'meal_time' && (
                  <label
                    className={cn(
                      `btn flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg text-sm font-normal whitespace-nowrap transition-colors btn-outline btn-sm btn-secondary select-none`,
                    )}
                    htmlFor={`${filter.type}-${filter.value}`}
                    key={`${filter.type}-${filter.value}`}
                    onClick={() => removeFilter(filter)}
                  >
                    <input
                      id={`${filter.type}-${filter.value}`}
                      type="checkbox"
                      onClick={() => removeFilter(filter)}
                      className="h-0 w-0 flex-shrink-0 opacity-0"
                    />
                    <span className="pb-[2px]">
                      {filter.type === 'preparation_time' &&
                        t('mealPlanning.dialog.filters.prep', 'Prep: ')}
                      {filter.type === 'cooking_time' &&
                        t('mealPlanning.dialog.filters.cook', 'Cook: ')}
                      {capitalize(filter.label)}
                    </span>
                    <X size={15} />
                  </label>
                ),
            )}
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className={`btn h-fit w-fit shrink-0 items-center gap-1.5 self-start p-0 pt-1 text-secondary btn-link`}
          >
            <span className="">
              {t(
                'mealPlanning.dialog.filters.clearAllFilters',
                'Clear all filters',
              )}
            </span>
            <FilterIcon className="h-3 w-3 pt-[2px]" />
          </button>
        )}
        <RecipeFiltersPopover className="self-start" />
      </div>
    </div>
  );
}
