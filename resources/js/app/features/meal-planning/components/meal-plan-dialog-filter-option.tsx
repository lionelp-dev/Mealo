import { Typography } from '@/app/components/Typography';
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
    <Typography
      as="label"
      variant="label"
      tone="muted"
      className="first:border-t-none flex cursor-pointer items-center justify-between gap-4 px-4 py-[4px] transition-colors select-none last:border-b last:border-base-300/40 hover:bg-base-300/30"
      htmlFor={key}
    >
      <Typography as="span" variant="body-sm" tone="inherit">
        {capitalize(
          t(`mealPlanning.dialog.filters.${filter.label}`, filter.label),
        )}
      </Typography>
      <Checkbox
        id={key}
        checked={isActive}
        onCheckedChange={handleCheckedChange}
        className="flex-shrink-0"
      />
    </Typography>
  );
}
