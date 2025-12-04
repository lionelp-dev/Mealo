import { createListCollection, Portal, Select } from '@ark-ui/react';
import { usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, ChevronDownIcon, X } from 'lucide-react';
import { DateTime } from 'luxon';

import { MealTime } from '@/types';
import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import MealPlanDialogFilters from './meal-plan-dialog-filters';
import MealPlanDialogRecipes from './meal-plan-dialog-recipes';
import MealPlanDialogSearchRecipes from './meal-plan-dialog-search-recipes';
import { Button } from './ui/button';

type PageProps = {
  mealTimes: MealTime[];
  plannedMeals: any[];
  weekStart: string;
};

export default function MealPlanDialog() {
  const { mealTimes, plannedMeals, weekStart } = usePage<PageProps>().props;

  const {
    isOpen,
    setIsOpen,
    selectedDate,
    selectedRecipesId,
    selectedMealTimeId,
    setSelectedMealTimeId,
    planSelectedMeals,
  } = useWeekPlannedMeals({
    weekStart: DateTime.fromISO(weekStart),
    mealTimes,
    plannedMeals,
  });

  const collection = createListCollection({
    items: mealTimes
      .sort((a, b) => a.id - b.id)
      .map((mealTime) => ({
        label: mealTime.name,
        value: String(mealTime.id),
      })),
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 flex h-[90vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-3 rounded-xl bg-white pt-12 pr-14 pb-11 pl-14">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Dialog.Title>
                <span className="text-3xl font-bold">Add meal</span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" className="!static hover:text-red-600">
                  <X size={24} />
                </Button>
              </Dialog.Close>
            </div>
            <div className="flex items-center gap-4">
              <CalendarDays size={24} />
              <span className="pt-1 text-2xl">
                {selectedDate?.toFormat('EEEE dd MMMM')!}
              </span>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
            <MealPlanDialogFilters />
            <MealPlanDialogSearchRecipes />
            <MealPlanDialogRecipes />
          </div>
          <div className="mt-5 flex items-center justify-end">
            <div className="flex items-baseline justify-end gap-4">
              <span className="pl-3 text-base">
                When would you like to eat this ?
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
                  <Select.Trigger className="flex h-9 w-fit items-center gap-3 rounded-md border border-blue-500 pr-3 pl-5 text-sm text-blue-600 hover:border-gray-400 focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] focus:outline-none">
                    <Select.ValueText placeholder="Meal time" />
                    <Select.Indicator>
                      <ChevronDownIcon />
                    </Select.Indicator>
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content className="z-[10000] flex rounded-md bg-white px-2 py-3 shadow-[0px_-1px_1px_2px_rgba(0,0,0,0.05)]">
                      <Select.ItemGroup className="flex flex-col gap-2">
                        {collection.items.map((item) => (
                          <Select.Item
                            key={item.value}
                            item={item}
                            className="flex cursor-pointer rounded-md px-3 hover:bg-gray-100"
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
                <Button
                  disabled={
                    selectedRecipesId.length === 0 || !selectedMealTimeId
                  }
                  onClick={planSelectedMeals}
                >
                  {selectedRecipesId.length > 0
                    ? `Plan dish (${selectedRecipesId.length})`
                    : 'Plan dish'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
