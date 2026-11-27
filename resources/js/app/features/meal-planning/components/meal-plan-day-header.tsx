import { useMealPlanDayActions } from '../hooks/use-meal-plan-day-actions';
import { Typography } from '@/app/components/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
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
    <div className="flex items-center justify-between px-1.25 pl-2.25">
      <Typography
        as="span"
        variant="body-sm"
        weight="semibold"
        tone={isCurrentDay ? 'secondary' : 'default'}
        className="flex items-center gap-2"
      >
        <Typography as="span" variant="title" tone="secondary">
          {date.weekdayLong &&
            `${date.weekdayLong[0].toUpperCase()}${date.weekdayLong
              .slice(1)
              .replace(/\.$/, '')}`}
        </Typography>
        <Typography as="span" variant="title" tone="secondary">
          {date.day}
        </Typography>
        {isCurrentDay && (
          <Typography
            as="span"
            variant="body-sm"
            className="badge rounded-full badge-soft badge-secondary"
          >
            Aujourd'hui
          </Typography>
        )}
      </Typography>
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
    </>
  );
}
