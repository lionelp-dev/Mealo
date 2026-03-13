import { useMealPlanActions } from '@/hooks/use-meal-plan-actions';
import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import recipes from '@/routes/recipes';
import { PlannedMeal } from '@/types';
import { router } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MealPlanMealCard({
  plannedMeal,
}: {
  plannedMeal: PlannedMeal;
}) {
  const { t } = useTranslation();

  const { id, recipe, serving_size } = plannedMeal;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { unplanMeals } = useMealPlanActions();

  const handleView = () => {
    router.reload({ reset: ['flash'] });
    router.visit(recipes.show.url({ recipe: recipe.id }));
  };

  const { canEditMealPlan } = useWorkspacePermissions();

  return (
    <div
      key={id}
      className="card w-full overflow-hidden rounded-md border-l-2 border-l-secondary/40 bg-base-100 !p-0 shadow-xs outline outline-offset-0 outline-base-300/50 card-xs hover:shadow-md hover:[&_.meal-card-actions-btn]:visible"
      onMouseLeave={() => setIsOpen(false)}
    >
      {recipe.image_url && (
        <figure className="h-26">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
        </figure>
      )}
      <div className="card-body overflow-hidden py-1.5 pr-2 pl-3.5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="flex w-full min-w-0 items-center text-sm">
            <span className="-ml-1 w-full truncate text-sm text-base-content">
              {recipe.name}
            </span>
            {serving_size > 1 && (
              <span className="shrink-0">(x{serving_size})</span>
            )}
          </span>
          <Popover.Root open={isOpen} key={recipe.id}>
            <Popover.Trigger asChild>
              <button
                id=""
                onClick={() => setIsOpen(!isOpen)}
                className={`meal-card-actions-btn btn invisible flex-shrink-0 ${isOpen && 'visible'} btn-circle btn-ghost btn-sm hover:bg-base-200`}
              >
                <Ellipsis size={15} className="text-base-content/75" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[10000]"
                side="bottom"
                align="end"
                sideOffset={4}
                onMouseLeave={() => {
                  setIsOpen(false);
                }}
              >
                <div className="rounded-md border border-base-300 bg-base-100 p-2 text-right shadow-[1px_1px_1px_4px_rgba(0,0,0,0.01)]">
                  <ul className="flex flex-col gap-1 [&_>_button]:justify-end">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={handleView}
                    >
                      <li>{t('common.buttons.view', 'View')}</li>
                    </button>
                    {canEditMealPlan && (
                      <button
                        className="btn text-error btn-ghost btn-sm hover:border-error/5 hover:bg-error/10"
                        onClick={() => unplanMeals([plannedMeal.id])}
                      >
                        <li>{t('common.buttons.delete', 'Delete')}</li>
                      </button>
                    )}
                  </ul>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </div>
  );
}
