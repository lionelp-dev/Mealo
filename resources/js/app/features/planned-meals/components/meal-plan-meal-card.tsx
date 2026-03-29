import { useMealPlanActions } from '../hooks/use-meal-plan-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { PlannedMeal } from '@/types';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import recipes from '@/routes/recipes';
import { router } from '@inertiajs/react';
import { Ellipsis, EyeIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MealPlanMealCard({
  plannedMeal,
}: {
  plannedMeal: PlannedMeal;
}) {
  const { t } = useTranslation();

  const { id, recipe, serving_size } = plannedMeal;
  const [isOpen, setIsOpen] = useState(false);

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
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="meal-card-actions-btn btn invisible btn-circle shrink-0 btn-ghost btn-sm hover:bg-base-200">
                <Ellipsis size={15} className="text-base-content/75" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={4}
              onMouseLeave={() => setIsOpen(false)}
            >
              <DropdownMenuItem onClick={handleView}>
                <EyeIcon size={14} />
                {t('common.buttons.view', 'View')}
              </DropdownMenuItem>
              {canEditMealPlan && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => unplanMeals([plannedMeal.id])}
                >
                  <Trash2Icon size={14} />
                  {t('common.buttons.delete', 'Delete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
