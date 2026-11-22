import { MealTimeResource, TagResource } from '../data/resources/recipe/types';
import { RecipesFilterOption } from './recipes-filter-option';
import { Typography } from '@/app/components/Typography';
import { useRecipesMultiSelectStore } from '@/app/features/recipes/stores/use-recipes-multi-select-store';
import { cn } from '@/app/lib/';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { Filter, FilterSection, Option } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { ClassValue } from 'clsx';
import { FilterIcon, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TIME_OPTIONS: Option[] = [
  { label: '0 - 15 min', value: '[0..15]' },
  { label: '15 - 30 min', value: '[15..30]' },
  { label: '30 - 60 min', value: '[30..60]' },
  { label: '+ 1h', value: '>60' },
];

type Props = {
  tags: TagResource[];
  mealTimes?: MealTimeResource[];
  className?: ClassValue;
  side?: Popover.PopoverContentProps['side'];
  align?: Popover.PopoverContentProps['align'];
  sideOffset?: Popover.PopoverContentProps['sideOffset'];
  label?: string;
  compact?: boolean;
  showActiveCount?: boolean;
};

export function RecipesFiltersPopover({
  tags,
  mealTimes = [],
  className,
  side = 'bottom',
  align = 'end',
  sideOffset = 6,
  label,
  compact = false,
  showActiveCount = true,
}: Props) {
  const { t } = useTranslation();

  const { activeFilters, isFilterActive, selectSingleFilter, toggleTagFilter } =
    useRecipesFiltersStore();

  const createMealTimesSection = (
    mealTimes: MealTimeResource[],
  ): FilterSection => ({
    title: 'mealTime',
    type: 'meal_time',
    options: mealTimes.map((mealTime) => ({
      label: mealTime.slug,
      value: mealTime.id.toString(),
    })),
  });

  const { setIsMultiSelectMode, clearSelectedRecipes } =
    useRecipesMultiSelectStore();

  const createTagsSection = (tags: TagResource[]): FilterSection => ({
    title: 'tags',
    type: 'tag',
    options:
      tags?.map((tag) => ({
        label: tag.name,
        value: tag.id?.toString() ?? '',
      })) ?? [],
  });

  const FILTERS_SECTIONS: FilterSection[] = [
    ...(mealTimes.length > 0 ? [createMealTimesSection(mealTimes)] : []),
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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap text-secondary hover:text-secondary-content max-md:max-w-fit',
            'btn border border-secondary/40 px-4 btn-outline btn-soft btn-secondary max-md:px-3',
            className,
          )}
          onClick={() => {
            setIsMultiSelectMode(false);
            clearSelectedRecipes();
          }}
        >
          {compact ? (
            <SlidersHorizontal className="h-4 w-auto" />
          ) : (
            <FilterIcon className="h-4 w-auto pt-[1.5px]" />
          )}
          <Typography as="span" variant="body-sm" tone="inherit">
            {label ?? t('recipes.filters.advanced', 'Filtres avancés')}
          </Typography>
          {showActiveCount && activeFilters.length > 0 && (
            <Typography
              as="span"
              variant="caption"
              tone="inherit"
              weight="semibold"
              className={cn(
                'flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-secondary-content',
                !compact && 'min-lg:hidden',
              )}
            >
              {activeFilters.length}
            </Typography>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[225px] rounded-md border border-base-300 bg-base-100 p-2 shadow-lg"
          style={{
            overflowY: 'auto',
          }}
          side={side}
          align={align}
          sideOffset={sideOffset}
          onWheel={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-1.5">
            {FILTERS_SECTIONS.map((section) => (
              <div
                key={section.type}
                className="flex max-h-[calc(26_*_1vh)] flex-col"
              >
                <Typography
                  as="span"
                  variant="body-sm"
                  weight="medium"
                  className="px-2 pb-1"
                >
                  {t(
                    `mealPlanning.dialog.filters.${section.title}`,
                    section.title,
                  )}
                </Typography>
                <div className="divide-y divide-base-300/40 overflow-y-scroll">
                  {section.options.map((option) => {
                    const filter: Filter = {
                      type: section.type,
                      value: option.value,
                      label: option.label,
                    };
                    return (
                      <RecipesFilterOption
                        key={`${filter.type}-${filter.value}`}
                        filter={filter}
                        handleCheckedChange={() => {
                          if (filter.type === 'tag') {
                            toggleTagFilter(filter);
                          } else {
                            selectSingleFilter(filter);
                          }

                          setIsOpen(false);
                        }}
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
