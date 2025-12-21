import { Checkbox } from '@/components/ui/checkbox';
import * as Popover from '@radix-ui/react-popover';
import { ChevronRightIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMealPlanData } from '../hooks/use-meal-plan-data';
import {
  Filter,
  FilterType,
  useRecipeSearchStore,
} from '../stores/recipe-search';

enum MealTime {
  BREAKFAST = '1',
  LUNCH = '2',
  DINNER = '3',
  SNACK = '4',
}

type FilterOption = {
  label: string;
  value: string;
};

const TIME_OPTIONS: FilterOption[] = [
  { label: '0 - 15 min', value: '[0..15]' },
  { label: '15 - 30 min', value: '[15..30]' },
  { label: '30 - 60 min', value: '[30..60]' },
  { label: '+ 1h', value: '>60' },
];

export default function MealPlanDialogFilters() {
  const { t } = useTranslation();

  const { activeFilters, addFilter, removeFilter, clearFilters, isSearching } =
    useRecipeSearchStore();

  const { tags } = useMealPlanData();

  const MEAL_TIME_OPTIONS: FilterOption[] = [
    {
      label: t('mealPlanning.dialog.filters.breakfast'),
      value: MealTime.BREAKFAST,
    },
    { label: t('mealPlanning.dialog.filters.lunch'), value: MealTime.LUNCH },
    { label: t('mealPlanning.dialog.filters.dinner'), value: MealTime.DINNER },
    { label: t('mealPlanning.dialog.filters.snack'), value: MealTime.SNACK },
  ];

  const FILTER_SECTIONS = [
    {
      title: t('mealPlanning.dialog.filters.mealTime'),
      type: 'meal_time' as FilterType,
      options: MEAL_TIME_OPTIONS,
    },
    {
      title: t('mealPlanning.dialog.filters.preparationTime'),
      type: 'preparation_time' as FilterType,
      options: TIME_OPTIONS,
    },
    {
      title: t('mealPlanning.dialog.filters.cookingTime'),
      type: 'cooking_time' as FilterType,
      options: TIME_OPTIONS,
    },
  ] as const;

  const isFilterActive = (type: FilterType, value: string) => {
    return activeFilters.some((f) => f.type === type && f.value === value);
  };

  const toggleFilter = (filter: Filter) => {
    if (isFilterActive(filter.type as FilterType, filter.value)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  const renderFilterOption = (option: FilterOption, filterType: FilterType) => {
    const filter: Filter = {
      type: filterType,
      value: option.value,
      label: option.label,
    };
    const isActive = isFilterActive(filterType, option.value);
    const key = `${filterType}-${option.value}`;
    return (
      <label
        className={`flex cursor-pointer items-center gap-3 rounded px-2 py-1 pl-2 transition-colors select-none ${
          isActive ? 'bg-base-200 text-base-content' : 'hover:bg-base-200'
        }`}
        htmlFor={key}
      >
        <Checkbox
          id={key}
          checked={isActive}
          onCheckedChange={() => toggleFilter(filter)}
          disabled={isSearching}
          className="flex-shrink-0"
        />
        <span>{option.label}</span>
      </label>
    );
  };

  const renderActiveFilter = (filter: Filter) => (
    <button
      key={`${filter.type}-${filter.value}`}
      onClick={() => removeFilter(filter)}
      disabled={isSearching}
      className="flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-3 pl-4 text-sm whitespace-nowrap text-base-content transition-colors hover:border-error hover:bg-base-100 disabled:cursor-not-allowed disabled:opacity-50 [&:hover]:text-error"
    >
      <span>
        {filter.type === 'preparation_time' &&
          t('mealPlanning.dialog.filters.prep')}
        {filter.type === 'cooking_time' &&
          t('mealPlanning.dialog.filters.cook')}
        {filter.label}
      </span>
      <X size={14} />
    </button>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-base-content">
          {t('mealPlanning.dialog.filterRecipes')}
        </span>

        <Popover.Root>
          <Popover.Trigger
            className="btn flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors btn-outline disabled:opacity-50"
            disabled={isSearching}
          >
            {activeFilters.length === 0
              ? t('mealPlanning.dialog.addFilters')
              : `${activeFilters.length} ${activeFilters.length > 1 ? t('mealPlanning.dialog.filters.filters') : t('mealPlanning.dialog.filters.filter')}`}
            <ChevronRightIcon size={16} />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="z-50 min-w-[300px] rounded-lg border bg-base-100 p-4 shadow-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <div className="space-y-4">
                {FILTER_SECTIONS.map((section) => (
                  <div key={section.type} className="space-y-2">
                    <span className="font-medium">{section.title}</span>
                    <div className="space-y-1">
                      {section.options.map((option) =>
                        renderFilterOption(option, section.type),
                      )}
                    </div>
                  </div>
                ))}

                {Array.isArray(tags) && tags.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-medium text-base-content">
                      {t('mealPlanning.dialog.filters.tags')}
                    </span>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="space-y-1">
                        {tags.map((tag) =>
                          renderFilterOption(
                            {
                              label: tag.name,
                              value: tag.id?.toString() ?? '',
                            },
                            'tag',
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {activeFilters.map(renderActiveFilter)}
          </div>
          <button
            onClick={clearFilters}
            disabled={isSearching}
            className="btn text-sm text-base-content btn-link underline hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('mealPlanning.dialog.filters.clearAllFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
