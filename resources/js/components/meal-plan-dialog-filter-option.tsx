import { FilterType } from '@/stores/recipe-search';
import { Checkbox } from './ui/checkbox';

type Props = {
  filter: {
    type: FilterType;
    label: string;
    value: string;
  };
  isActive: boolean;
  handleCheckedChange: () => void;
};

export function MealPlanDialogFilterOption({
  filter,
  isActive,
  handleCheckedChange,
}: Props) {
  const key = `${filter.type}-${filter.value}`;
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded px-2 py-1 pl-2 transition-colors select-none ${
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
      <span>{filter.label}</span>
    </label>
  );
}
