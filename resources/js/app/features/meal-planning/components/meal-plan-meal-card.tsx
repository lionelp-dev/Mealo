import { useMealPlanActions } from '../hooks/use-meal-plan-actions';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import { PlannedMeal } from '@/types';
import { RecipeResourceData } from '@/types/generated';
import { Ellipsis, EyeIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MealPlanMealCard({
  plannedMeal,
  onSelectRecipe,
}: {
  plannedMeal: PlannedMeal;
  onSelectRecipe: (recipe: RecipeResourceData) => void;
}) {
  const { t } = useTranslation();
  const { plannedMealImages } = usePlannedMealsContextValue();

  const { id, recipe, serving_size } = plannedMeal;
  const imageUrl = plannedMealImages[recipe.id] ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { unplanMeals } = useMealPlanActions();

  const handleView = () => {
    onSelectRecipe(recipe);
  };

  const { canEditMealPlan } = useWorkspacePermissions();

  return (
    <div
      key={id}
      className="card w-full cursor-pointer overflow-hidden rounded-md border-l-2 border-l-secondary/40 bg-base-100 !p-0 shadow-xs outline outline-offset-0 outline-base-300/50 card-xs hover:shadow-md hover:[&_.meal-card-actions-btn]:visible"
      onClick={() => onSelectRecipe(recipe)}
    >
      {imageUrl && (
        <figure className="relative h-19">
          {!imageLoaded && (
            <div className="absolute inset-0 h-full w-full skeleton rounded-none" />
          )}
          <img
            src={imageUrl}
            alt={recipe.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      <div className="card-body overflow-hidden py-[0.45rem] pr-2 pl-4.5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="flex w-full min-w-0 items-center text-sm">
            <span className="-ml-1 w-full truncate text-sm text-base-content">
              {recipe.name}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-base-content/60">
            <UsersIcon size={12} />
            {serving_size}
          </span>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="meal-card-actions-btn btn invisible btn-circle shrink-0 btn-ghost btn-sm hover:bg-base-200"
                onClick={(event) => event.stopPropagation()}
              >
                <Ellipsis size={15} className="text-base-content/75" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={4}
              onMouseLeave={() => setIsOpen(false)}
            >
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  handleView();
                }}
              >
                <EyeIcon size={14} />
                {t('common.buttons.view', 'View')}
              </DropdownMenuItem>
              {canEditMealPlan && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(event) => {
                    event.stopPropagation();
                    unplanMeals([plannedMeal.id]);
                  }}
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
