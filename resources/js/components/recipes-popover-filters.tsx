import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useRecipesRequestCoordination } from '@/hooks/use-recipes-request-coordination';
import { cn } from '@/lib/utils';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { Filter, FilterSection, Option, Tag } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { ClassValue } from 'clsx';
import { FilterIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MealPlanDialogFilterOption } from './meal-plan-dialog-filter-option';

enum MealTimeEnum {
  BREAKFAST = '1',
  LUNCH = '2',
  DINNER = '3',
  SNACK = '4',
}

export const TIME_OPTIONS: Option[] = [
  { label: '0 - 15 min', value: '[0..15]' },
  { label: '15 - 30 min', value: '[15..30]' },
  { label: '30 - 60 min', value: '[30..60]' },
  { label: '+ 1h', value: '>60' },
];

export const MEAL_TIME_OPTIONS: Option[] = [
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
];

type Props = {
  tags: Tag[];
  className?: ClassValue;
  side?: Popover.PopoverContentProps['side'];
  align?: Popover.PopoverContentProps['align'];
  sideOffset?: Popover.PopoverContentProps['sideOffset'];
};

export function RecipesPopoverFilters({
  tags,
  className,
  side = 'bottom',
  align = 'end',
  sideOffset = 5,
}: Props) {
  const { t } = useTranslation();

  const { triggerRecipesRequest } = useRecipesRequestCoordination();

  const { activeFilters, isFilterActive, toggleFilter } =
    useRecipeFiltersStore();

  const { setIsMultiSelectMode, clearSelectedRecipes } = useMultiSelectRecipe();

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    triggerRecipesRequest();
  }, [activeFilters]);

  const filterButtonLabel =
    activeFilters.length === 0
      ? t('mealPlanning.dialog.addFilters')
      : `${activeFilters.length} ${activeFilters.length > 1 ? t('mealPlanning.dialog.filters.filters') : t('mealPlanning.dialog.filters.filter')} ${activeFilters.length > 1 ? t('common.buttons.selected.plural') : t('common.buttons.selected.singular')}`;

  const createTagsSection = (tags: Tag[]): FilterSection => ({
    title: 'tags',
    type: 'tag',
    options: tags.map((tag) => ({
      label: tag.name,
      value: tag.id?.toString() ?? '',
    })),
  });

  const FILTERS_SECTIONS: FilterSection[] = [
    {
      title: 'mealTime',
      type: 'meal_time',
      options: MEAL_TIME_OPTIONS,
    },
    { ...createTagsSection(tags) },
    {
      title: 'preparationTime',
      type: 'preparation_time',
      options: TIME_OPTIONS,
    },
    {
      title: 'cookingTime',
      type: 'cooking_time',
      options: TIME_OPTIONS,
    },
  ];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={cn(
            `btn col-start-5 w-fit items-center gap-[5px] justify-self-end`,
            className,
          )}
          onClick={() => {
            setIsMultiSelectMode(false);
            clearSelectedRecipes();
          }}
        >
          {filterButtonLabel}
          <FilterIcon size={14} className="mb-[1px]" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[225px] rounded-lg border border-base-300 bg-base-100 p-4 shadow-lg"
          style={{
            overflowY: 'auto',
          }}
          side={side}
          align={align}
          sideOffset={sideOffset}
          onWheel={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-4 divide-y divide-base-300/70">
            {FILTERS_SECTIONS.map((section) => (
              <div
                key={section.type}
                className="flex max-h-[calc(21.5_*_1vh)] flex-col"
              >
                <span className="text-sm font-medium">
                  {t(
                    `mealPlanning.dialog.filters.${section.title}`,
                    section.title,
                  )}
                </span>
                <div className="overflow-y-scroll">
                  {section.options.map((option) => {
                    const filter: Filter = {
                      type: section.type,
                      value: option.value,
                      label: option.label,
                    };
                    return (
                      <MealPlanDialogFilterOption
                        filter={filter}
                        handleCheckedChange={() => toggleFilter(filter)}
                        isActive={isFilterActive(filter)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
