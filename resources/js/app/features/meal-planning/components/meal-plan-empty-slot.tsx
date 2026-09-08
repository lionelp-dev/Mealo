import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { Plus } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type MealPlanEmptySlotProps = React.ComponentProps<'div'> & {
  date: DateTime;
};

export default function MealPlanEmptySlot({
  date,
  ...rest
}: MealPlanEmptySlotProps) {
  const { t } = useTranslation();

  const { openMealPlanDialog } = useMealPlanDialogStore();

  const { canPlanMeal } = useWorkspacePermissions();

  return (
    <div
      className={`sticky right-0 bottom-0 left-0 flex h-full flex-1 flex-col items-start justify-start gap-5 rounded-md text-gray-400 transition-all duration-200 ease-in-out`}
      {...rest}
    >
      {canPlanMeal && (
        <button
          type="button"
          className="group flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-base-300 bg-base-100/80 px-4 py-11 text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out hover:border-primary hover:bg-primary/10 hover:text-primary lg:py-8"
          onClick={() => openMealPlanDialog(date)}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-base-200 text-gray-500 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-content">
            <Plus className="size-3.5" strokeWidth={2.5} />
          </span>
          {t('mealPlanning.actions.planMeal', 'Plan meal')}
        </button>
      )}
    </div>
  );
}
