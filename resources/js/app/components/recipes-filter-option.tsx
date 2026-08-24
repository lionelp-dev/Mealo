import { Checkbox } from '@/app/components/ui/checkbox';
import { capitalize } from '@/app/utils/';
import { Filter } from '@/types';
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
      className={`flex min-w-0 cursor-pointer items-center justify-between gap-4 px-4 py-[4px] text-sm text-base-content transition-colors select-none first:border-t-0 last:border-b last:border-base-300/40 hover:bg-base-300/30`}
      htmlFor={key}
    >
      <span className="min-w-0 truncate">
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
