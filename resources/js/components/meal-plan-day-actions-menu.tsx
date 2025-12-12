import { Button } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

import { CopiedDayPlannedMeals } from '@/stores/week-meal-planner';

type DayActionsMenuProps = {
  hasPlannedMeals: boolean;
  copiedDayPlannedMeals: CopiedDayPlannedMeals | null;
  onCopy: () => void;
  onPaste: () => void;
  onDeleteAll: () => void;
};

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

function ActionButton({ onClick, children }: ActionButtonProps) {
  return (
    <li className="flex">
      <Button onClick={onClick} className="flex-1 justify-start">
        {children}
      </Button>
    </li>
  );
}

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
    <div className="rounded-md border border-gray-100 bg-white p-2 text-right shadow-[1px_1px_1px_4px_rgba(0,0,0,0.01)]">
      <ul className="flex flex-col gap-1 [&_li]:cursor-pointer [&_li]:rounded-sm [&_li]:py-1 [&_li]:pr-3 [&_li]:pl-2 [&_li:hover]:bg-gray-100">
        {hasPlannedMeals && <ActionButton onClick={onCopy}>{t('mealPlanning.actions.copy')}</ActionButton>}
        {copiedDayPlannedMeals && (
          <ActionButton onClick={onPaste}>{t('mealPlanning.actions.paste')}</ActionButton>
        )}
        {hasPlannedMeals && (
          <ActionButton onClick={onDeleteAll}>{t('mealPlanning.actions.deleteAll')}</ActionButton>
        )}
      </ul>
    </div>
  );
}
