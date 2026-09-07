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
import { Ellipsis, EyeIcon, Trash2Icon } from 'lucide-react';
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
  const { plannedMealImages, mealTimes } = usePlannedMealsContextValue();

  const { recipe } = plannedMeal;
  const imageUrl = plannedMealImages[recipe.id] ?? null;
  const mealTime = mealTimes.find(({ id }) => id === plannedMeal.meal_time_id);
  const mealTimeLabel = mealTime
    ? t(`mealPlanning.dialog.filters.${mealTime.slug}`, mealTime.name)
    : '';
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group flex w-full cursor-pointer items-stretch gap-3.25 overflow-hidden rounded-[14px] border border-base-300/50 bg-base-100 px-2.5 py-2 pr-2.75 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 focus-within:border-base-300 focus-within:shadow-sm hover:border-base-300 hover:shadow-sm hover:[&_.meal-card-actions-btn]:opacity-100"
      onClick={() => onSelectRecipe(recipe)}
    >
      <div className="relative h-21.5 w-28 shrink-0 overflow-hidden rounded-[12px] bg-base-200/70">
        {imageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-base-200" />
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
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.45),rgba(255,255,255,0.12))]" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 self-stretch py-2">
        {mealTimeLabel && (
          <p className="text-xs font-semibold tracking-[0.01em] text-secondary/80 uppercase">
            {mealTimeLabel}
          </p>
        )}
        <p className="line-clamp-2 text-base leading-[1.275] font-semibold break-words text-base-content">
          {recipe.name}
        </p>
      </div>

      <MealPlanMealCardButtonMenu
        plannedMeal={plannedMeal}
        onSelectRecipe={onSelectRecipe}
      />
    </div>
  );
}

export function MealPlanMealCardButtonMenu({
  plannedMeal,
  onSelectRecipe,
}: {
  plannedMeal: PlannedMeal;
  onSelectRecipe: (recipe: RecipeResourceData) => void;
}) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const { unplanMeals } = useMealPlanActions();

  const { recipe } = plannedMeal;

  const handleView = () => {
    onSelectRecipe(recipe);
  };

  const { canEditMealPlan } = useWorkspacePermissions();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t('common.buttons.more', 'More actions')}
          className="btn self-center py-3.5 btn-ghost btn-xs"
          onClick={(event) => event.stopPropagation()}
        >
          <Ellipsis size={18} className="text-base-content/65" />
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
  );
}
