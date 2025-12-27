import { Filter } from '@/stores/recipe-search';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  filter: Filter;
  handleDelete: (filter: Filter) => void;
};
export function MealPlanDialogActiveFilter({ filter, handleDelete }: Props) {
  const { t } = useTranslation();
  return (
    <button
      key={`${filter.type}-${filter.value}`}
      onClick={() => handleDelete(filter)}
      className="flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pr-3 pl-4 text-sm whitespace-nowrap text-base-content transition-colors hover:border-error hover:bg-base-100 disabled:cursor-not-allowed disabled:opacity-50 [&:hover]:text-error"
    >
      <span>
        {filter.type === 'preparation_time' &&
          t('mealPlanning.dialog.filters.prep')}
        {filter.type === 'cooking_time' &&
          t('mealPlanning.dialog.filters.cook')}
        {filter.label}
      </span>
      <X size={14} />
    </button>
  );
}
