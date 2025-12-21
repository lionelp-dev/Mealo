import * as Popover from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@headlessui/react';
import { useMealPlanDayActions } from '../hooks/use-meal-plan-day-actions';
import { useDayHeaderState } from '../hooks/use-meal-plan-day-state';
import { DayPlannedMeals } from '../stores/week-meal-planner';
import DayActionsMenu from './meal-plan-day-actions-menu';

type MealPlanDayHeaderProps = {
  dayPlannedMeals: DayPlannedMeals;
};

export default function MealPlanDayHeader({
  dayPlannedMeals,
}: MealPlanDayHeaderProps) {
  const {
    date,
    isCurrentDay,
    hasPlannedMeals,
    isOpen,
    setIsOpen,
    closeMenu,
    toggleMenu,
  } = useDayHeaderState(dayPlannedMeals);

  const { copiedDayPlannedMeals, handleCopy, handlePaste, handleDeleteAll } =
    useMealPlanDayActions(dayPlannedMeals);

  const onCopy = () => {
    handleCopy();
    closeMenu();
  };

  const onPaste = () => {
    handlePaste();
    closeMenu();
  };

  const onDeleteAll = () => {
    handleDeleteAll();
    closeMenu();
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg border bg-background px-5 py-3 shadow-sm ${
        isCurrentDay ? 'border-base-content' : 'border-base-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`text-base-content' } text-lg`}>{date.weekdayLong}</div>
        <div
          className={`text-base-content' } flex h-7 w-7 items-center justify-center rounded-full text-base font-medium`}
        >
          {date.day}
        </div>
      </div>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button onClick={toggleMenu} className="btn btn-ghost btn-sm">
            <EllipsisVertical size={15} className="text-base-content" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-[10000]"
            side="bottom"
            align="end"
            sideOffset={4}
            onInteractOutside={() => {
              setIsOpen(false);
            }}
          >
            <DayActionsMenu
              hasPlannedMeals={hasPlannedMeals}
              copiedDayPlannedMeals={copiedDayPlannedMeals}
              onCopy={onCopy}
              onPaste={onPaste}
              onDeleteAll={onDeleteAll}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
