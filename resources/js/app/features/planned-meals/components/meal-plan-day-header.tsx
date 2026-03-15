import { useMealPlanDayActions } from '../hooks/use-meal-plan-day-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { DayPlannedMeals } from '@/app/entities/planned-meal/types';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { cn } from '@/app/lib/';
import {
  ClipboardPasteIcon,
  CopyIcon,
  EllipsisVertical,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
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
    handleCopy,
    handlePaste,
    handleDeleteAll,
  } = useMealPlanDayActions(dayPlannedMeals);

  const [isOpen, setIsOpen] = useState(false);

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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button className="btn btn-circle btn-ghost btn-sm hover:bg-base-200">
              <EllipsisVertical
                size={15}
                className="rotate-90 text-base-content/75"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={4}
            onMouseLeave={() => setIsOpen(false)}
          >
            {hasPlannedMeals && (
              <DropdownMenuItem onClick={handleCopy}>
                <CopyIcon size={14} />
                {t('mealPlanning.actions.copy', 'Copy')}
              </DropdownMenuItem>
            )}
            {copiedDayPlannedMeals && (
              <DropdownMenuItem onClick={handlePaste}>
                <ClipboardPasteIcon size={14} />
                {t('mealPlanning.actions.paste', 'Paste')}
              </DropdownMenuItem>
            )}
            {hasPlannedMeals && (
              <DropdownMenuItem variant="destructive" onClick={handleDeleteAll}>
                <Trash2Icon size={14} />
                {t('mealPlanning.actions.deleteAll', 'Delete all')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
