import { useTranslation } from 'react-i18next';
import {
  Filter,
  FilterType,
  useRecipeSearchStore,
} from '../stores/recipe-search';
import { useMealPlanData } from './use-meal-plan-data';

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

export function useMealPlanDialogFilters() {
  const { t } = useTranslation();
  const { tags } = useMealPlanData();
  const { activeFilters, addFilter, removeFilter, clearFilters, isSearching } =
    useRecipeSearchStore();

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

  const isFilterActive = ({
    type,
    value,
  }: {
    type: FilterType;
    value: string;
  }) => {
    return activeFilters.some((f) => f.type === type && f.value === value);
  };

  const toggleFilter = (filter: Filter) => {
    if (isFilterActive(filter)) {
      removeFilter(filter);
    } else {
      addFilter(filter);
    }
  };

  return {
    activeFilters,
    isSearching,
    tags,
    FILTER_SECTIONS,
    isFilterActive,
    toggleFilter,
    clearFilters,
    removeFilter,
  };
}
