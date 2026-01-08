import { useMealPlanActions } from '@/hooks/use-meal-plan-actions';
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

  const { id, recipe } = plannedMeal;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { unplanMeals } = useMealPlanActions();

  const handleView = () => {
    router.reload({ reset: ['flash'] });
    router.visit(recipes.show.url({ recipe: recipe.id }));
  };

  return (
    <div
      key={id}
      className="card rounded-md border border-base-300/50 bg-base-100 shadow-xs card-xs hover:shadow-md hover:[&_.meal-card-actions-btn]:visible"
      onMouseLeave={() => setIsOpen(false)}
    >
      {recipe.image_url && (
        <figure className="h-28">
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
        </figure>
      )}
      <div className="card-body py-1.5">
        <div className="flex items-center justify-between">
          <div className="card-title contents">
            <span className="text-md overflow-hidden px-2.5 font-normal text-ellipsis whitespace-nowrap text-base-content">
              {recipe.name}
            </span>
          </div>
          <Popover.Root open={isOpen} key={recipe.id}>
            <Popover.Trigger asChild>
              <button
                id=""
                onClick={() => setIsOpen(!isOpen)}
                className={`meal-card-actions-btn btn invisible ${isOpen && 'visible'} btn-circle btn-ghost btn-sm hover:bg-base-200`}
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
                    <button
                      className="btn text-error btn-ghost btn-sm hover:border-error/5 hover:bg-error/10"
                      onClick={() => unplanMeals([plannedMeal.id])}
                    >
                      <li>{t('common.buttons.delete', 'Delete')}</li>
                    </button>
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
