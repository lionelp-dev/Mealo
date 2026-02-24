import * as Popover from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';

import { useMealPlanDayActions } from '@/hooks/use-meal-plan-day-actions';
import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import { cn } from '@/lib/utils';
import { DayPlannedMeals } from '@/types';
import { Button } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

type MealPlanDayHeaderProps = {
  dayPlannedMeals: DayPlannedMeals;
};

export default function MealPlanDayHeader({
  dayPlannedMeals,
}: MealPlanDayHeaderProps) {
  const { t } = useTranslation();

  const {
    date,
    isCurrentDay,
    hasPlannedMeals,
    copiedDayPlannedMeals,
    isOpen,
    setIsOpen,
    toggleMenu,
    handleCopy,
    handlePaste,
    handleDeleteAll,
  } = useMealPlanDayActions(dayPlannedMeals);

  const { canEditMealPlan } = useWorkspacePermissions();

  return (
    <div
      className={`flex h-12 items-center justify-between rounded-lg bg-background pr-3 pl-5 shadow-xs outline outline-base-300/40 ${
        isCurrentDay && 'border-b-2 border-secondary/80 pb-[1px] text-secondary'
      }`}
    >
      <div
        className={cn(
          'flex items-center gap-2 text-base font-normal text-base-content/80',
          isCurrentDay && 'text-secondary',
        )}
      >
        <span>
          {date.weekdayLong && date.weekdayLong[0].toUpperCase()}
          {date.weekdayLong?.slice(1)}
        </span>
        <span>{date.day}</span>
      </div>
      {canEditMealPlan && (hasPlannedMeals || copiedDayPlannedMeals) && (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <Button
              onClick={toggleMenu}
              className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
            >
              <EllipsisVertical
                size={15}
                className="rotate-90 text-base-content/75"
              />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-[10000]"
              side="bottom"
              align="end"
              sideOffset={4}
              onMouseLeave={() => {
                setIsOpen(false);
              }}
            >
              <div className="rounded-md border border-base-300 bg-base-100 p-2 text-right shadow-[1px_1px_1px_4px_rgba(0,0,0,0.01)]">
                <div className="flex flex-col gap-1">
                  {hasPlannedMeals && (
                    <button
                      className="btn w-full justify-end text-base-content btn-ghost btn-sm"
                      onClick={handleCopy}
                    >
                      {t('mealPlanning.actions.copy', 'Copy')}
                    </button>
                  )}
                  {copiedDayPlannedMeals && (
                    <button
                      className="btn w-full justify-end text-base-content btn-ghost btn-sm"
                      onClick={handlePaste}
                    >
                      {t('mealPlanning.actions.paste', 'Paste')}
                    </button>
                  )}
                  {hasPlannedMeals && (
                    <button
                      className="btn w-full justify-end text-base-content btn-ghost btn-sm"
                      onClick={handleDeleteAll}
                    >
                      {t('mealPlanning.actions.deleteAll', 'Delete all')}
                    </button>
                  )}
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  );
}
