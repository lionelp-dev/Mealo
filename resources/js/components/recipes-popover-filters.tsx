import { useRecipeFiltersContext } from '@/contexts/recipe-filters-context';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useRecipesRequestCoordination } from '@/hooks/use-recipes-request-coordination';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { Filter, FilterSection, Option, Tag } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { ClassValue } from 'clsx';
import { FilterIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MealPlanDialogFilterOption } from './meal-plan-dialog-filter-option';

export const TIME_OPTIONS: Option[] = [
  { label: '0 - 15 min', value: '[0..15]' },
  { label: '15 - 30 min', value: '[15..30]' },
  { label: '30 - 60 min', value: '[30..60]' },
  { label: '+ 1h', value: '>60' },
];

type Props = {
  className?: ClassValue;
  side?: Popover.PopoverContentProps['side'];
  align?: Popover.PopoverContentProps['align'];
  sideOffset?: Popover.PopoverContentProps['sideOffset'];
};

export function RecipeFiltersPopover({
  className,
  side = 'bottom',
  align = 'end',
  sideOffset = 6,
}: Props) {
  const { t } = useTranslation();

  const { tags } = useRecipeFiltersContext();

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

  const createTagsSection = (tags: Tag[]): FilterSection => ({
    title: 'tags',
    type: 'tag',
    options: tags.map((tag) => ({
      label: tag.name,
      value: tag.id?.toString() ?? '',
    })),
  });

  const FILTERS_SECTIONS: FilterSection[] = [
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
          className={`btn col-start-4 row-start-1 items-center gap-1.5 self-start border border-secondary/40 pr-3.5 pl-5 whitespace-nowrap text-secondary btn-outline btn-soft btn-secondary hover:text-secondary-content`}
          onClick={() => {
            setIsMultiSelectMode(false);
            clearSelectedRecipes();
          }}
        >
          <span>Filtres avancés</span>
          <FilterIcon className={'h-4 w-auto pt-[2px]'} />
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
                <span className="px-2 pb-1 text-sm font-medium">
                  {t(
                    `mealPlanning.dialog.filters.${section.title}`,
                    section.title,
                  )}
                </span>
                <div className="divide-y divide-base-300/40 overflow-y-scroll">
                  {section.options.map((option) => {
                    const filter: Filter = {
                      type: section.type,
                      value: option.value,
                      label: option.label,
                    };
                    return (
                      <MealPlanDialogFilterOption
                        filter={filter}
                        handleCheckedChange={() => {
                          toggleFilter(filter);
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
