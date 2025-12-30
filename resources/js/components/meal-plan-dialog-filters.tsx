import { useMealPlanDialogStore } from '@/stores/meal-plan-dialog';
import { Filter } from '@/stores/recipe-search';
import * as Popover from '@radix-ui/react-popover';
import { FilterIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMealPlanDialogFilters } from '../hooks/use-meal-plan-dialog-filters';
import { MealPlanDialogActiveFilter } from './meal-plan-dialog-active-filter';
import { MealPlanDialogFilterOption } from './meal-plan-dialog-filter-option';

export default function MealPlanDialogFilters() {
  const { t } = useTranslation();
  const {
    activeFilters,
    tags,
    FILTER_SECTIONS,
    isFilterActive,
    toggleFilter,
    clearFilters,
    removeFilter,
  } = useMealPlanDialogFilters();

  const { setIsMultiSelectMode, clearSelectedRecipes } =
    useMealPlanDialogStore();

  const filterButtonLabel =
    activeFilters.length === 0
      ? t('mealPlanning.dialog.addFilters')
      : `${activeFilters.length} ${activeFilters.length > 1 ? t('mealPlanning.dialog.filters.filters') : t('mealPlanning.dialog.filters.filter')}`;

  return (
    <>
      {activeFilters.length > 0 && (
        <>
          <div className="col-start-2 col-end-6 row-start-2 flex flex-wrap gap-x-2 gap-y-3">
            {activeFilters.map((filter) => (
              <MealPlanDialogActiveFilter
                filter={filter}
                handleDelete={() => removeFilter(filter)}
              />
            ))}
          </div>
          <button
            onClick={clearFilters}
            className="btn col-start-1 row-start-2 mb-[2px] w-fit items-center gap-3 text-sm text-base-content btn-link underline btn-sm hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('mealPlanning.dialog.filters.clearAllFilters')}
          </button>
        </>
      )}

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className={`btn col-start-5 w-fit items-center gap-[5px] justify-self-end ${!(activeFilters.length > 0) && 'btn-outline'} btn-secondary`}
            onClick={() => {
              setIsMultiSelectMode(false);
              clearSelectedRecipes();
            }}
          >
            <FilterIcon size={14} className="mb-[1px]" />
            {filterButtonLabel}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 min-w-[300px] rounded-lg border border-base-300 bg-base-100 p-4 shadow-lg"
            style={{
              overflowY: 'auto',
            }}
            side="bottom"
            align="end"
            sideOffset={5}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {FILTER_SECTIONS.map((section) => (
                <div key={section.type} className="space-y-2">
                  <span className="font-medium">{section.title}</span>
                  <div className="space-y-1">
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

              {Array.isArray(tags) && tags.length > 0 && (
                <div className="space-y-2">
                  <span className="font-medium text-base-content">
                    {t('mealPlanning.dialog.filters.tags')}
                  </span>
                  <div className="max-h-32 overflow-scroll">
                    <div className="space-y-1">
                      {tags.map((tag) => {
                        const filter: Filter = {
                          type: 'tag',
                          label: tag.name,
                          value: tag.id?.toString() ?? '',
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
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
