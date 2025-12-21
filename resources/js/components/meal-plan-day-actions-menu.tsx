import { useTranslation } from 'react-i18next';

import { CopiedDayPlannedMeals } from '../stores/week-meal-planner';

type DayActionsMenuProps = {
  hasPlannedMeals: boolean;
  copiedDayPlannedMeals: CopiedDayPlannedMeals | null;
  onCopy: () => void;
  onPaste: () => void;
  onDeleteAll: () => void;
};

export default function DayActionsMenu({
  hasPlannedMeals,
  copiedDayPlannedMeals,
  onCopy,
  onPaste,
  onDeleteAll,
}: DayActionsMenuProps) {
  const { t } = useTranslation();

  if (!hasPlannedMeals && !copiedDayPlannedMeals) {
    return null;
  }

  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-2 text-right shadow-[1px_1px_1px_4px_rgba(0,0,0,0.01)]">
      <div className="flex flex-col gap-1 [&_li]:cursor-pointer [&_li]:rounded-sm [&_li]:py-1 [&_li]:pr-3 [&_li]:pl-2 [&_li:hover]:bg-base-300">
        {hasPlannedMeals && (
          <button
            className="btn w-full justify-end text-base-content btn-ghost"
            onClick={onCopy}
          >
            {t('mealPlanning.actions.copy')}
          </button>
        )}
        {copiedDayPlannedMeals && (
          <button
            className="btn w-full justify-end text-base-content btn-ghost"
            onClick={onPaste}
          >
            {t('mealPlanning.actions.paste')}
          </button>
        )}
        {hasPlannedMeals && (
          <button
            className="btn w-full justify-end text-base-content btn-ghost"
            onClick={onDeleteAll}
          >
            {t('mealPlanning.actions.deleteAll')}
          </button>
        )}
      </div>
    </div>
  );
}
