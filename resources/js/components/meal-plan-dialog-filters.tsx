import { Filter, FilterType, useRecipeSearchStore } from '@/stores/recipe-search';
import { Tag } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { usePage } from '@inertiajs/react';
import { ChevronRightIcon, X } from 'lucide-react';

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

const MEAL_TIME_OPTIONS: FilterOption[] = [
  { label: 'Breakfast', value: MealTime.BREAKFAST },
  { label: 'Lunch', value: MealTime.LUNCH },
  { label: 'Dinner', value: MealTime.DINNER },
  { label: 'Snack', value: MealTime.SNACK },
];

const TIME_OPTIONS: FilterOption[] = [
  { label: '0 - 15 min', value: '[0..15]' },
  { label: '15 - 30 min', value: '[15..30]' },
  { label: '30 - 60 min', value: '[30..60]' },
  { label: '+ 1h', value: '>60' },
];

const FILTER_SECTIONS = [
  {
    title: 'Meal Time',
    type: 'meal_time' as FilterType,
    options: MEAL_TIME_OPTIONS,
  },
  {
    title: 'Preparation Time',
    type: 'preparation_time' as FilterType,
    options: TIME_OPTIONS,
  },
  {
    title: 'Cooking Time',
    type: 'cooking_time' as FilterType,
    options: TIME_OPTIONS,
  },
] as const;

type PageProps = {
  tags: Tag[];
};

export default function MealPlanDialogFilters() {
  const { tags } = usePage<PageProps>().props;

  const { activeFilters, addFilter, removeFilter, clearFilters, isSearching } =
    useRecipeSearchStore();

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

    return (
      <label
        key={option.value}
        className={`flex cursor-pointer items-center gap-3 rounded px-2 py-1 pl-2 transition-colors select-none ${
          isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
        }`}
      >
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => toggleFilter(filter)}
          disabled={isSearching}
          className="rounded"
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
      className="flex items-center gap-2 rounded-full border border-gray-300 py-1.5 pr-3 pl-4 text-sm whitespace-nowrap transition-colors hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>
        {filter.type === 'preparation_time' && 'Prep: '}
        {filter.type === 'cooking_time' && 'Cook: '}
        {filter.label}
      </span>
      <X size={14} className="text-gray-500 hover:text-red-500" />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Filter recipes</span>

        <Popover.Root>
          <Popover.Trigger
            className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-colors hover:border-gray-400 focus:border-blue-400 focus:outline-none disabled:opacity-50"
            disabled={isSearching}
          >
            {activeFilters.length === 0
              ? 'Add filters'
              : `${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''}`}
            <ChevronRightIcon size={16} />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content 
              className="z-50 min-w-[300px] rounded-lg border bg-white p-4 shadow-lg"
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
                    <span className="font-medium">Tags</span>
                    <div className="max-h-32 space-y-1 overflow-y-auto">
                      {tags.map((tag) =>
                        renderFilterOption(
                          { label: tag.name, value: tag.id?.toString() ?? '' },
                          'tag',
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(renderActiveFilter)}
          </div>
          <button
            onClick={clearFilters}
            disabled={isSearching}
            className="text-sm text-gray-500 underline hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
