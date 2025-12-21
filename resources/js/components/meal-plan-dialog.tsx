import { createListCollection, Portal, Select } from '@ark-ui/react';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, ChevronDownIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useRecipeSearchStore } from '@/stores/recipe-search';
import { ReactNode } from 'react';
import { useMealPlanData } from '../hooks/use-meal-plan-data';
import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import i18n from '../lib/i18n';
import MealPlanDialogFilters from './meal-plan-dialog-filters';
import MealPlanDialogSearchRecipes from './meal-plan-dialog-search-recipes';

type MealPlanDialogProps = {
  open: boolean;
  children?: ReactNode;
};

export default function MealPlanDialog({
  open,
  children,
}: MealPlanDialogProps) {
  const { t } = useTranslation();

  const { mealTimes, recipes } = useMealPlanData();

  const {
    setIsOpen,
    selectedDate,
    selectedRecipesId,
    selectedMealTimeId,
    setSelectedMealTimeId,
    planSelectedMeals,
  } = useWeekPlannedMeals();

  const collection = createListCollection({
    items: mealTimes
      .sort((a, b) => a.id - b.id)
      .map((mealTime) => ({
        label: t(`mealPlanning.dialog.filters.${mealTime.name}`),
        value: String(mealTime.id),
      })),
  });

  const { searchTerm, activeFilters } = useRecipeSearchStore();

  return (
    <Dialog.Root open={open} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 flex h-[90vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-3 rounded-xl bg-base-100 pt-12 pr-14 pb-11 pl-14">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Dialog.Title>
                <span className="text-3xl font-bold text-base-content">
                  {t('mealPlanning.dialog.title')}
                </span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="btn !static text-base-content btn-ghost hover:text-red-600">
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex items-center gap-4">
              <CalendarDays size={24} className="text-base-content" />
              <span className="pt-1 text-2xl text-base-content">
                {
                  selectedDate
                    ?.setLocale(i18n.language)
                    .toFormat('EEEE d MMMM')!
                }
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
            <MealPlanDialogFilters />
            <MealPlanDialogSearchRecipes />
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

          <div className="mt-5 flex items-center justify-end">
            <div className="flex items-baseline justify-end gap-4">
              <span className="pl-3 text-base">
                {t('mealPlanning.dialog.whenToEat')}
              </span>

              <Select.Root
                collection={collection}
                value={selectedMealTimeId ? [String(selectedMealTimeId)] : []}
                onValueChange={(e) => {
                  setSelectedMealTimeId(Number(e.items[0].value));
                }}
                positioning={{ placement: 'top-end' }}
                className="h-full"
              >
                <Select.Control className="h-full">
                  <Select.Trigger className="btn btn-outline">
                    <Select.ValueText
                      placeholder={t('mealPlanning.mealTimeSelection')}
                    />
                    <Select.Indicator>
                      <ChevronDownIcon />
                    </Select.Indicator>
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content className="z-[100] flex rounded-md border border-base-300 bg-base-100 px-2 py-3 shadow-[0px_-1px_1px_2px_rgba(0,0,0,0.05)]">
                      <Select.ItemGroup className="flex flex-col gap-1">
                        {collection.items.map((item) => (
                          <Select.Item
                            key={item.value}
                            item={item}
                            className="flex cursor-pointer rounded-xs px-3 py-1 hover:bg-base-200"
                          >
                            <Select.ItemText>{item.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
              </Select.Root>
              <div className="flex gap-5">
                <button
                  className="btn btn-primary"
                  disabled={
                    selectedRecipesId.length === 0 || !selectedMealTimeId
                  }
                  onClick={planSelectedMeals}
                >
                  {selectedRecipesId.length > 1
                    ? `${t('mealPlanning.planDishes')} (${selectedRecipesId.length})`
                    : t('mealPlanning.planDish')}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
