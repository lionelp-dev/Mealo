import { RecipeResourceData } from '@/types/generated';
import {
  Clock3Icon,
  CookingPotIcon,
  Edit2Icon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RecipeDetailPanelProps = {
  recipe: RecipeResourceData;
  onClose: () => void;
  onEdit?: () => void;
};

export default function RecipeDetailPanel({
  recipe,
  onClose,
  onEdit,
}: RecipeDetailPanelProps) {
  const { t } = useTranslation();
  const sortedSteps = [...recipe.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-base-300/40 bg-base-100 shadow-xs">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.buttons.close', 'Close')}
        className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-base-100/90 text-base-content/70 shadow-xs backdrop-blur-sm transition hover:bg-base-200 hover:text-base-content"
      >
        <XIcon size={18} />
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={t('common.buttons.edit', 'Edit')}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-base-100/90 text-base-content/70 shadow-xs backdrop-blur-sm transition hover:bg-base-200 hover:text-base-content"
        >
          <Edit2Icon size={16} />
        </button>
      )}
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="top-0 z-10 flex flex-col gap-2 bg-white min-lg:sticky">
            {recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="h-50 w-full object-cover min-md:h-70 min-lg:h-60"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="flex w-full max-w-2xl flex-col gap-2 self-center px-4 min-md:pt-4 min-lg:px-4">
              <h2 className="overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap text-base-content">
                {recipe.name}
              </h2>
              <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
                {recipe.description}
              </p>
            </div>
          </div>
          <div className="flex max-w-2xl flex-col gap-3 self-center px-4 pb-5 min-lg:px-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex min-w-0 flex-col gap-1 rounded-md bg-base-200/65 px-3 py-2.5">
                <Clock3Icon size={15} className="text-base-content/60" />
                <span className="text-xs text-base-content/60">
                  {t('recipes.table.preparationTime', 'Preparation time')}
                </span>
                <span className="text-sm font-semibold text-base-content">
                  {recipe.preparation_time} min
                </span>
              </div>

              <div className="flex min-w-0 flex-col gap-1 rounded-md bg-base-200/65 px-3 py-2.5">
                <CookingPotIcon size={15} className="text-base-content/60" />
                <span className="text-xs text-base-content/60">
                  {t('recipes.table.cookingTime', 'Cooking time')}
                </span>
                <span className="text-sm font-semibold text-base-content">
                  {recipe.cooking_time} min
                </span>
              </div>

              <div className="flex min-w-0 flex-col gap-1 rounded-md bg-base-200/65 px-3 py-2.5">
                <UsersIcon size={15} className="text-base-content/60" />
                <span className="text-xs text-base-content/60">
                  {t('recipes.show.servingSize', 'Portions')}
                </span>
                <span className="text-sm font-semibold text-base-content">
                  {recipe.serving_size}
                </span>
              </div>
            </div>

            {(recipe.meal_times.length > 0 || recipe.tags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {recipe.meal_times.map((mealTime) => (
                  <span
                    key={mealTime.id}
                    className="badge rounded-full badge-soft badge-outline border-secondary/15 badge-sm badge-secondary"
                  >
                    {t(
                      `mealPlanning.dialog.filters.${mealTime.name}`,
                      mealTime.name,
                    )}
                  </span>
                ))}
                {recipe.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="badge rounded-full bg-base-200 badge-sm text-base-content"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-base-content">
                  {t('recipes.form.ingredientsTitle', 'Ingredients')}
                </h3>
                <div className="overflow-hidden rounded-md border border-base-300/55">
                  {recipe.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex items-center justify-between gap-3 border-b border-base-300/55 px-3 py-2 text-sm last:border-b-0"
                    >
                      <span className="min-w-0 truncate font-medium text-base-content">
                        {ingredient.name}
                      </span>
                      <span className="shrink-0 text-base-content/70">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sortedSteps.length > 0 && (
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-base-content">
                  {t('recipes.form.stepsTitle', 'Steps')}
                </h3>
                <div className="grid gap-4">
                  {sortedSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-4 text-sm"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary-content">
                        {step.order}
                      </span>
                      <p className="leading-6 text-base-content/75">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
