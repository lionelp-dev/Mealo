import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import MealPlanDialogSearchRecipes from './meal-plan-dialog-search-recipes';
import MultiSelectMealPlanningPopover from './multi-select-meal-planning-popover';
import { RecipeFilters } from './recipe-filters';
import { useMealPlanContext } from '@/contexts/meal-plan-context';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useUrlFilterSync } from '@/hooks/use-url-filter-sync';
import i18n from '@/lib/i18n';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { useRecipeSearchStore } from '@/stores/recipe-search';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

type MealPlanDialogProps = {
  children?: ReactNode;
};

export default function MealPlanDialog({ children }: MealPlanDialogProps) {
  const { t } = useTranslation();

  const { recipes } = useMealPlanContext();

  const { isOpen, setIsOpen, selectedDate } = useMealPlanDialogStore();

  const { searchTerm } = useRecipeSearchStore();

  const { activeFilters, clearAllFilters } = useRecipeFiltersStore();
  useUrlFilterSync();

  const [
    isMultiSelectMealPlanningPopoverOpen,
    setIsMultiSelectMealPlanningPopoverOpen,
  ] = useState<boolean>(false);

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipesId,
    clearSelectedRecipes,
  } = useMultiSelectRecipe();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => {
        clearAllFilters();
        setIsOpen(isOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-20 flex h-[91vh] w-[65vw] flex-1 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-3 rounded-xl bg-base-100 p-7 pb-6">
          <Dialog.Title className="flex flex-col gap-3.5 pb-0.5">
            <span className="-mb-1.5 flex flex-col gap-0.5">
              <span className="flex flex-1 justify-between">
                <span className="text-3xl font-bold text-secondary">
                  Plannifier des repas
                </span>
                <Dialog.Close asChild>
                  <button className="btn btn-circle text-base-content btn-ghost btn-sm">
                    <X size={24} />
                  </button>
                </Dialog.Close>
              </span>
              <span className="text-lg text-secondary">
                Pour{' '}
                {selectedDate &&
                  selectedDate
                    ?.setLocale(i18n.language)
                    .toFormat('EEEE d MMMM')}
              </span>
            </span>
            <MealPlanDialogSearchRecipes />
            <RecipeFilters />
          </Dialog.Title>

          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
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
                  {t(
                    'mealPlanning.dialog.multiSelect.clearSelection',
                    'Clear selection',
                  )}
                </button>
                <MultiSelectMealPlanningPopover
                  className="border-base-300"
                  isMultiSelectMealPlanningPopoverOpen={
                    isMultiSelectMealPlanningPopoverOpen
                  }
                  setIsMultiSelectMealPlanningPopoverOpen={
                    setIsMultiSelectMealPlanningPopoverOpen
                  }
                  selectedRecipesId={selectedRecipesId}
                />
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
