import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import { ChefHat } from 'lucide-react';
import { DateTime } from 'luxon';
import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';

type MealPlanEmptySlotProps = React.ComponentProps<'div'> & {
  containerRef: RefObject<HTMLDivElement | null>;
  date: DateTime;
};

export default function MealPlanEmptySlot({
  containerRef,
  date,
  ...rest
}: MealPlanEmptySlotProps) {
  const { t } = useTranslation();

  const { openMealPlanDialog } = useMealPlanDialogStore();

  const { canPlanMeal } = useWorkspacePermissions();

  return (
    <div
      className={`sticky right-0 bottom-0 left-0 flex flex-1 flex-col items-center justify-center gap-5 rounded-md border border-dashed border-base-300 bg-base-100/80 py-6 text-gray-400 transition-all duration-200 ease-in-out`}
      {...rest}
    >
      {canPlanMeal && (
        <button
          className="btn cursor-pointer items-center gap-2 rounded-full pl-4.5 outline outline-offset-0 outline-secondary/40 btn-sm btn-secondary"
          onClick={() => openMealPlanDialog(date)}
        >
          <span className="leading-0 font-normal">
            {t('mealPlanning.actions.planMeal', 'Plan meal')}
          </span>
          <ChefHat size={14} />
        </button>
      )}
    </div>
  );
}
