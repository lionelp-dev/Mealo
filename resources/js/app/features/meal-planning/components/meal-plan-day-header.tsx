import { useMealPlanDayActions } from '../hooks/use-meal-plan-day-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { cn } from '@/app/lib/';
import { DayPlannedMeals } from '@/types';
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
  const { date, isCurrentDay } = useMealPlanDayActions(dayPlannedMeals);

  return (
    <div className={`flex items-center justify-between px-5`}>
      <div
        className={cn(
          'flex items-center gap-2 text-xl font-semibold text-base-content/80',
          isCurrentDay && 'text-secondary',
        )}
      >
        <span>
          {date.weekdayLong && date.weekdayLong[0].toUpperCase()}
          {date.weekdayLong?.slice(1)}
        </span>
        <span>{date.day}</span>
        {isCurrentDay && (
          <span className="badge rounded-full badge-soft badge-secondary">
            Aujourd'hui
          </span>
        )}
      </div>
      <MealPlanDayHeaderMenu dayPlannedMeals={dayPlannedMeals} />
    </div>
  );
}

export function MealPlanDayHeaderMenu({
  dayPlannedMeals,
}: MealPlanDayHeaderProps) {
  const { canEditMealPlan } = useWorkspacePermissions();

  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation();

  const {
    hasPlannedMeals,
    copiedDayPlannedMeals,
    handleCopy,
    handlePaste,
    handleDeleteAll,
  } = useMealPlanDayActions(dayPlannedMeals);

  return (
    <>
      {canEditMealPlan && (hasPlannedMeals || copiedDayPlannedMeals) && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button className="btn btn-circle btn-sm hover:bg-base-200">
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
    </>
  );
}
