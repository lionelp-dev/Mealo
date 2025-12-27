import * as Popover from '@radix-ui/react-popover';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMealPlanDialogFilters } from '../hooks/use-meal-plan-dialog-filters';
import { Filter } from '../stores/recipe-search';
import { MealPlanDialogActiveFilter } from './meal-plan-dialog-active-filter';
import { MealPlanDialogFilterOption } from './meal-plan-dialog-filter-option';

export default function MealPlanDialogFilters() {
  const { t } = useTranslation();
  const {
    activeFilters,
    isSearching,
    tags,
    FILTER_SECTIONS,
    isFilterActive,
    toggleFilter,
    clearFilters,
    removeFilter,
  } = useMealPlanDialogFilters();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-base-content">
          {t('mealPlanning.dialog.filterRecipes')}
        </span>

        <Popover.Root>
          <Popover.Trigger className="btn flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors btn-outline disabled:opacity-50">
            {activeFilters.length === 0
              ? t('mealPlanning.dialog.addFilters')
              : `${activeFilters.length} ${activeFilters.length > 1 ? t('mealPlanning.dialog.filters.filters') : t('mealPlanning.dialog.filters.filter')}`}
            <ChevronRightIcon size={16} />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="z-50 min-w-[300px] rounded-lg border bg-base-100 p-4 shadow-lg"
              style={{
                maxHeight: 'var(--radix-popover-content-available-height)',
                overflowY: 'auto',
              }}
              side="bottom"
              align="end"
              sideOffset={4}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
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
      </div>

      {activeFilters.length > 0 && (
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {activeFilters.map((filter) => (
              <MealPlanDialogActiveFilter
                filter={filter}
                handleDelete={() => removeFilter(filter)}
              />
            ))}
          </div>
          <button
            onClick={clearFilters}
            className="btn text-sm text-base-content btn-link underline hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('mealPlanning.dialog.filters.clearAllFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
