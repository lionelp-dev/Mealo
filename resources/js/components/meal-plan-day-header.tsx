import * as Popover from '@radix-ui/react-popover';
import { usePage } from '@inertiajs/react';
import { EllipsisVertical } from 'lucide-react';
import { DateTime } from 'luxon';

import { useDayHeaderState } from '@/hooks/use-meal-plan-day-header';
import i18n from '@/lib/i18n';
import {
  CopiedDayPlannedMeals,
  CopiedMealSlot,
  DayPlannedMeals,
} from '@/stores/week-meal-planner';
import { MealTime, PlannedMeal } from '@/types';
import { Button } from '@headlessui/react';
import { useWeekPlannedMeals } from '../hooks/use-week-planned-meals';
import DayActionsMenu from './meal-plan-day-actions-menu';

type PageProps = {
  weekStart: string;
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
};

type MealPlanDayHeaderProps = {
  dayPlannedMeals: DayPlannedMeals;
};

type DayInfoProps = {
  date: DateTime;
  isCurrentDay: boolean;
};

const prepareMealSlotsForCopy = (
  dayPlannedMeals: DayPlannedMeals,
): CopiedMealSlot[] => {
  return dayPlannedMeals.plannedMealsSlots
    .flatMap((slot) => slot.plannedMeals)
    .map((plannedMeal) => ({
      recipe_id: plannedMeal.recipe.id,
      meal_time_id: plannedMeal.meal_time_id,
      planned_date: plannedMeal.planned_date,
    }));
};

const preparePastePayload = (
  copiedMeals: CopiedDayPlannedMeals,
  targetDate: string,
): CopiedDayPlannedMeals => ({
  planned_meals: copiedMeals.planned_meals.map((plannedMeal) => ({
    ...plannedMeal,
    planned_date: targetDate,
  })),
});

function DayInfo({ date, isCurrentDay }: DayInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`text-lg ${
          isCurrentDay ? 'text-[#3a5a40]' : 'text-gray-700'
        }`}
      >
        {date.setLocale(i18n.language).weekdayLong}
      </div>
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-base font-medium ${
          isCurrentDay ? 'text-[#3a5a40]' : 'text-gray-700'
        }`}
      >
        {date.day}
      </div>
    </div>
  );
}

export default function MealPlanDayHeader({
  dayPlannedMeals,
}: MealPlanDayHeaderProps) {
  const { weekStart, mealTimes, plannedMeals } = usePage<PageProps>().props;
  const currWeekStart = DateTime.fromISO(weekStart);

  const {
    setCopiedDayPlannedMeals,
    copiedDayPlannedMeals,
    planCopiedDayPlannedMeal,
    unplanMeals,
  } = useWeekPlannedMeals({
    weekStart: currWeekStart,
    mealTimes,
    plannedMeals,
  });

  const {
    isCurrentDay,
    hasPlannedMeals,
    isOpen,
    setIsOpen,
    closeMenu,
    toggleMenu,
  } = useDayHeaderState(dayPlannedMeals);

  const handleCopy = () => {
    if (dayPlannedMeals) {
      const mealsSlots = prepareMealSlotsForCopy(dayPlannedMeals);
      setCopiedDayPlannedMeals({ planned_meals: mealsSlots });
    }
    closeMenu();
  };

  const handlePaste = () => {
    const isoDate = dayPlannedMeals.date.toISODate();
    if (!isoDate || !copiedDayPlannedMeals) return;

    const payload = preparePastePayload(copiedDayPlannedMeals, isoDate);
    planCopiedDayPlannedMeal(payload);
    closeMenu();
  };

  const handleDeleteAll = () => {
    const plannedMealsId = dayPlannedMeals?.plannedMealsSlots.flatMap((slot) =>
      slot.plannedMeals.map((plannedMeal) => plannedMeal.id),
    );
    if (plannedMealsId) unplanMeals(plannedMealsId);
    closeMenu();
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg border bg-white px-5 py-3 shadow-sm ${
        isCurrentDay ? 'border-[#606c38]' : 'border-gray-200'
      }`}
    >
      <DayInfo date={dayPlannedMeals.date} isCurrentDay={isCurrentDay} />
      <Popover.Root
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <Popover.Trigger asChild>
          <Button onClick={toggleMenu} className="cursor-pointer rounded-md py-1 hover:bg-gray-200">
            <EllipsisVertical size={15} />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="z-[10000]"
            side="bottom"
            align="end"
            sideOffset={4}
            onInteractOutside={(event) => {
              setIsOpen(false);
            }}
          >
            <DayActionsMenu
              hasPlannedMeals={hasPlannedMeals}
              copiedDayPlannedMeals={copiedDayPlannedMeals}
              onCopy={handleCopy}
              onPaste={handlePaste}
              onDeleteAll={handleDeleteAll}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
