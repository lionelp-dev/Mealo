import { Checkbox } from '@/app/components/ui/checkbox';
import { capitalize } from '@/app/utils/';
import { Filter } from '@/types';
import { useTranslation } from 'react-i18next';

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
      className={`first:border-t-none flex cursor-pointer items-center justify-between gap-4 px-4 py-[4px] text-sm text-foreground/70 transition-colors select-none last:border-b last:border-base-300/40 hover:bg-base-300/30 hover:text-foreground`}
      htmlFor={key}
    >
      <span>
        {capitalize(
          t(`mealPlanning.dialog.filters.${filter.label}`, filter.label),
        )}
      </span>
      <Checkbox
        id={key}
        checked={isActive}
        onCheckedChange={handleCheckedChange}
        className="flex-shrink-0"
      />
    </label>
  );
}
