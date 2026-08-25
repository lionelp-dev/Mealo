import { cn } from '@/app/lib/';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { capitalize } from '@/app/utils/';
import { Filter, FilterSection } from '@/types';
import { TrashIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
        label: 'all',
        value: 'all',
      },
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
    ],
  },
];

export function RecipesFilters() {
  const { t } = useTranslation();

  const {
    activeFilters,
    mealTimeFilter,
    isFilterActive,
    selectSingleFilter,
    clearFilterType,
    removeFilter,
    clearAllFilters,
  } = useRecipesFiltersStore();

  return (
    <div className="flex h-fit min-w-0 flex-1 items-center gap-2.5 max-lg:w-full max-lg:flex-col max-lg:items-stretch min-md:max-w-fit">
      {FILTERS_SECTIONS.map((section) => (
        <div
          className="max-w-full min-w-0 rounded-lg bg-base-200"
          key={section.type}
        >
          <div className="join w-full">
            {section.options.map((option) => {
              const isAllOption = option.value === 'all';
              const filter: Filter | null = isAllOption
                ? null
                : {
                    type: section.type,
                    value: option.value,
                    label: option.label,
                  };
              const isActive = filter
                ? isFilterActive(filter)
                : !mealTimeFilter;

              return (
                <label
                  className={cn(
                    'btn join-item flex-1 items-center border-0 px-2 text-xs whitespace-nowrap min-sm:px-3 min-md:px-4',
                    isActive
                      ? 'btn-active btn-secondary'
                      : 'text-base-content btn-ghost',
                  )}
                  key={`${section.type}-${option.value}`}
                >
                  <span className="min-w-0 truncate">
                    {capitalize(
                      isAllOption
                        ? t('mealPlanning.dialog.filters.allCompact', 'Tous')
                        : t(
                            `mealPlanning.dialog.filters.${option.label}Compact`,
                            option.label,
                          ),
                    )}
                  </span>
                  <input
                    type="radio"
                    name="meal-time-filter"
                    checked={isActive}
                    onChange={() => {
                      if (!filter) {
                        clearFilterType('meal_time');
                        return;
                      }

                      selectSingleFilter(filter);
                    }}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex min-w-0 flex-wrap items-center gap-2.5 max-lg:hidden">
        {activeFilters.length > 0 &&
          activeFilters.map(
            (filter) =>
              filter.type !== 'meal_time' && (
                <label
                  className={cn(
                    `btn flex max-w-40 min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-full text-sm font-normal whitespace-nowrap transition-colors btn-sm btn-secondary select-none`,
                  )}
                  htmlFor={`${filter.type}-${filter.value}`}
                  key={`${filter.type}-${filter.value}`}
                  onClick={() => removeFilter(filter)}
                >
                  <input
                    id={`${filter.type}-${filter.value}`}
                    type="checkbox"
                    onChange={() => removeFilter(filter)}
                    className="h-0 w-0 flex-shrink-0 opacity-0"
                  />
                  <span className="min-w-0 truncate pb-[2px]">
                    {filter.type === 'preparation_time' &&
                      t('mealPlanning.dialog.filters.prep', 'Prep: ')}
                    {filter.type === 'cooking_time' &&
                      t('mealPlanning.dialog.filters.cook', 'Cook: ')}
                    {capitalize(filter.label)}
                  </span>
                  <X className="h-[15px] w-[15px] shrink-0" />
                </label>
              ),
          )}
        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className={`btn h-fit max-w-36 min-w-0 shrink-0 items-center gap-1.5 self-start p-0 pt-1 pl-1 text-secondary btn-link`}
          >
            <span className="min-w-0 truncate">
              {t(
                'mealPlanning.dialog.filters.clearAllFilters',
                'Clear all filters',
              )}
            </span>
            <TrashIcon className="h-4 w-auto shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
}
