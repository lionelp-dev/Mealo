import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, CalendarPlus, Copy, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useRecipeSearchStore } from '@/stores/recipe-search';
import { ReactNode, useState } from 'react';
import { useMealPlanData } from '../hooks/use-meal-plan-data';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import MealPlanDialogSearchRecipes from './meal-plan-dialog-search-recipes';

import i18n from '../lib/i18n';

import { useMealPlanActions } from '@/hooks/use-meal-plan-actions';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useUrlFilterSync } from '@/hooks/use-url-filter-sync';
import { cn } from '@/lib/utils';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import * as Popover from '@radix-ui/react-popover';
import { RecipesActiveFilters } from './recipes-active-filters';
import { RecipesPopoverFilters } from './recipes-popover-filters';

type MealPlanDialogProps = {
  children?: ReactNode;
};

export default function MealPlanDialog({ children }: MealPlanDialogProps) {
  const { t } = useTranslation();

  const { recipes, mealTimes, tags } = useMealPlanData();

  const { isOpen, setIsOpen, selectedDate } = useMealPlanDialogStore();

  const { searchTerm } = useRecipeSearchStore();

  const { planMeals } = useMealPlanActions();

  const { activeFilters, clearAllFilters } = useRecipeFiltersStore();
  useUrlFilterSync();

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipesId,
    clearSelectedRecipes,
  } = useMultiSelectRecipe();

  const [openPlanPopover, setOpenPlanPopover] = useState<boolean>(false);

  const date =
    selectedDate &&
    selectedDate
      ?.setLocale(i18n.language)
      .toFormat('EEEE d MMMM')[0]
      .toUpperCase() +
      selectedDate?.setLocale(i18n.language).toFormat('EEEE d MMMM').slice(1);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-20 flex h-[91vh] w-[65vw] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-3 rounded-xl bg-base-100 px-5 pt-8 pb-6">
          <div className="flex items-center justify-between pr-2">
            <Dialog.Title className="flex items-center">
              <span className="flex gap-4 pl-2 text-2xl font-bold text-base-content">
                <Calendar className="mb-[1px]" />
                {date}
              </span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="btn !static btn-circle text-base-content btn-sm">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
            <div className="grid grid-cols-[auto_10fr_7fr_max-content_max-content] items-center gap-5 gap-y-4 p-1">
              <MealPlanDialogSearchRecipes />
              <button
                className={`btn col-start-4 row-start-1 gap-2 justify-self-end whitespace-nowrap btn-outline btn-secondary ${
                  isMultiSelectMode ? 'btn-active' : ''
                }`}
                onClick={() => {
                  setIsMultiSelectMode(!isMultiSelectMode);
                  if (!isMultiSelectMode) {
                    clearSelectedRecipes();
                  }
                }}
              >
                {t('mealPlanning.planDishes', 'Plan dishes')}
                <Copy size={14} className="mb-[1px]" />
              </button>
              <RecipesActiveFilters className="col-start-2 col-end-6 row-start-2" />
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="btn col-start-1 row-start-2 mb-[2px] w-fit items-center gap-3 text-sm text-base-content btn-link underline btn-sm hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('mealPlanning.dialog.filters.clearAllFilters', 'Clear all filters')}
                </button>
              )}
              <RecipesPopoverFilters
                className={cn(
                  'btn-outline btn-secondary',
                  activeFilters.length > 0 && 'btn-active',
                )}
                tags={tags}
              />
            </div>

            {(!recipes || !recipes.data || recipes.data.length === 0) && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-base-content">
                  <p className="mb-2">No recipes found</p>
                  {(searchTerm || activeFilters.length > 0) && (
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  )}
                </div>
              </div>
            )}

            {children}
          </div>

          {isMultiSelectMode && selectedRecipesId.length > 0 && (
            <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 transform">
              <div className="join shadow-2xl">
                <button
                  className="btn join-item rounded-l-full border-base-300"
                  onClick={() => {
                    clearSelectedRecipes();
                    setIsMultiSelectMode(false);
                  }}
                >
                  {t('mealPlanning.dialog.multiSelect.abandon', 'Cancel')}
                </button>
                <button
                  className="btn join-item border-base-300 disabled:!bg-base-200"
                  disabled={selectedRecipesId.length === 0}
                  onClick={() => {
                    clearSelectedRecipes();
                  }}
                >
                  {t('mealPlanning.dialog.multiSelect.clearSelection', 'Clear selection')}
                </button>

                <Popover.Root
                  open={openPlanPopover}
                  onOpenChange={setOpenPlanPopover}
                >
                  <Popover.Trigger asChild>
                    <button
                      className="btn join-item flex items-center rounded-r-full pr-6 btn-secondary disabled:border disabled:border-base-300 disabled:!bg-base-200"
                      disabled={selectedRecipesId.length === 0}
                    >
                      <CalendarPlus size={16} className="mb-[2px]" />
                      <span>
                        {t('mealPlanning.dialog.multiSelect.plan', 'Plan')}
                      </span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      className="z-[10000] min-w-[200px] rounded-lg border border-base-300 bg-base-100 p-2 shadow-xl"
                      side="top"
                      align="end"
                      sideOffset={8}
                      alignOffset={-4}
                      onPointerLeave={() => {
                        setOpenPlanPopover(false);
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        {selectedDate && (
                          <div className="flex items-center gap-2 rounded-sm bg-base-200 px-2 py-2 text-xs text-base-content/60">
                            <Calendar size={14} className="mb-[2px]" />
                            {date}
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          {mealTimes.map((mealTime) => (
                            <button
                              key={mealTime.id}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-base-200 disabled:opacity-50"
                              onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault();

                                const date = selectedDate?.toISODate();

                                if (!date) return;

                                await planMeals({
                                  meals: selectedRecipesId.map((recipeId) => ({
                                    recipe_id: recipeId,
                                    meal_time_id: mealTime.id,
                                    planned_date: date,
                                  })),
                                  onSuccess: () => {
                                    setIsMultiSelectMode(false);
                                    clearSelectedRecipes();
                                    setOpenPlanPopover(false);
                                  },
                                });
                              }}
                            >
                              {t(
                                `mealPlanning.dialog.filters.${mealTime.name}`,
                                mealTime.name,
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Popover.Arrow className="fill-base-100 stroke-base-300" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
