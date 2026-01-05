import { Filter } from '@/types';
import { useTranslation } from 'react-i18next';
import { Checkbox } from './ui/checkbox';

type Props = {
  filter: Filter;
  isActive: boolean;
  handleCheckedChange: () => void;
};

export function MealPlanDialogFilterOption({
  filter,
  isActive,
  handleCheckedChange,
}: Props) {
  const { t } = useTranslation();
  const key = `${filter.type}-${filter.value}`;
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded px-1 py-[5px] text-sm text-base-content transition-colors select-none ${
        isActive ? 'bg-base-200 text-base-content' : 'hover:bg-base-200'
      }`}
      htmlFor={key}
    >
      <Checkbox
        id={key}
        checked={isActive}
        onCheckedChange={handleCheckedChange}
        className="flex-shrink-0"
      />
      <span>
        {t(`mealPlanning.dialog.filters.${filter.label}`, filter.label)}
      </span>
    </label>
  );
}
