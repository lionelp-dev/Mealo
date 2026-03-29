import { Checkbox } from '@/app/components/ui/checkbox';
import { Filter } from '@/types';
import { capitalize } from '@/app/utils/';
import { useTranslation } from 'react-i18next';

type Props = {
  filter: Filter;
  isActive: boolean;
  handleCheckedChange: () => void;
};

export function RecipesFilterOption({
  filter,
  isActive,
  handleCheckedChange,
}: Props) {
  const { t } = useTranslation();
  const key = `${filter.type}-${filter.value}`;
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-[4px] text-sm text-base-content transition-colors select-none first:border-t-0 last:border-b last:border-base-300/40 hover:bg-base-300/30`}
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
