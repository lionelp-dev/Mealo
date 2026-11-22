import { Typography } from '@/app/components/Typography';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { RecipeResourceData } from '@/types/generated';
import { ArrowLeft, Clock3, UtensilsCrossed, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DetailRecipe = RecipeResource | RecipeResourceData;

type Props = {
  recipe: DetailRecipe;
  onClose?: () => void;
  compact?: boolean;
  showDesktopCloseButton?: boolean;
};

export default function RecipeDetailPanel({
  recipe,
  onClose,
  compact,
  showDesktopCloseButton = true,
}: Props) {
  const { t } = useTranslation();
  const steps = [...recipe.steps].sort(
    (left, right) => left.order - right.order,
  );
  const ingredients = recipe.ingredients ?? [];
  const totalTime = recipe.preparation_time + recipe.cooking_time;

  return (
    <div
      className={`relative h-full min-h-0 flex-1 bg-base-100 lg:col-start-2 lg:row-start-1 ${compact ? '' : 'lg:w-[47rem] lg:flex-none lg:border-r lg:border-base-300/60'}`}
    >
      {onClose && showDesktopCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l’aperçu"
          className="btn absolute top-3 right-3 z-30 hidden btn-circle btn-soft btn-md lg:flex"
        >
          <X size={22} strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
      <aside
        aria-labelledby="recipe-detail-title"
        className="h-full min-h-0 overflow-y-auto px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6 lg:px-8 lg:py-7"
      >
        <div
          className={`${compact ? 'mx-auto max-w-150' : 'mx-0 max-w-none'} flex min-h-full w-full flex-col`}
        >
          <div className="relative sticky top-0 z-20 -mx-4 mb-2 bg-base-100 px-5 pt-4 pb-2 sm:-mx-6 sm:px-7 lg:hidden">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 text-base font-semibold text-secondary lg:hidden"
              >
                <ArrowLeft size={22} aria-hidden="true" />
                Retour aux recettes
              </button>
            )}
          </div>
          {!compact && (
            <Typography
              as="p"
              variant="overline"
              tone="muted"
              className="mb-2 hidden lg:block"
            >
              Aperçu de la recette
            </Typography>
          )}
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={`Photo de ${recipe.name}`}
              className="aspect-[2.3/1] w-full rounded-2xl object-cover shadow-sm"
            />
          ) : (
            <div className="aspect-[2.3/1] rounded-2xl bg-base-200" />
          )}
          <div className="flex flex-1 flex-col px-1 pt-4 pb-5 sm:pb-6">
            <div className="sticky top-12 z-10 -mx-1 bg-base-100 px-2 pt-2 pb-2 sm:px-2 lg:top-0 lg:mx-0 lg:px-0">
              <Typography
                as="h2"
                variant="heading"
                id="recipe-detail-title"
                weight="bold"
              >
                {recipe.name}
              </Typography>
            </div>
            <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-base-content/55 sm:mt-2 sm:gap-x-5">
              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                <dd>{totalTime} min</dd>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={16} />
                <dd>{ingredients.length} ingrédients</dd>
              </div>
            </dl>
            <Typography
              as="p"
              variant="body-sm"
              tone="muted"
              className="mt-3 max-w-2xl sm:mt-4"
            >
              {recipe.description || 'Aucune description disponible.'}
            </Typography>
            {(recipe.meal_times.length > 0 || recipe.tags.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.meal_times.map((mealTime) => (
                  <Typography
                    as="span"
                    variant="body-sm"
                    key={mealTime.id}
                    tone="secondary"
                    className="badge h-7 bg-secondary/10 px-3"
                  >
                    {mealTime.name}
                  </Typography>
                ))}
                {recipe.tags.map((tag) => (
                  <Typography
                    as="span"
                    variant="body-sm"
                    key={tag.id}
                    tone="muted"
                    className="badge h-7 border-base-content/30 px-3"
                  >
                    {tag.name}
                  </Typography>
                ))}
              </div>
            )}
            <section className="mt-6 flex-1 border-t border-base-300 pt-5">
              <div className="flex items-center justify-between">
                <Typography as="h2" variant="heading" weight="bold">
                  Ingrédients
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                  Liste indicative
                </Typography>
              </div>
              {ingredients.length ? (
                <ul className="mt-3 space-y-0.5">
                  {ingredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex items-center justify-between gap-3 px-1 py-2 text-sm text-base-content/70"
                    >
                      <Typography
                        as="span"
                        variant="body-sm"
                        className="truncate"
                      >
                        {ingredient.name}
                      </Typography>
                      <Typography
                        as="span"
                        variant="body-sm"
                        className="shrink-0"
                      >
                        {ingredient.quantity}{' '}
                        {t(`ingredientUnits.${ingredient.unit}`, {
                          defaultValue: ingredient.unit,
                        })}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography
                  as="p"
                  variant="body-sm"
                  tone="muted"
                  className="mt-3"
                >
                  Aucun ingrédient pour le moment.
                </Typography>
              )}
            </section>
            <section className="mt-6 border-t border-base-300 pt-5">
              <Typography as="h2" variant="heading" weight="bold">
                Préparation
              </Typography>
              {steps.length ? (
                <ol className="mt-3 space-y-3">
                  {steps.map((step) => (
                    <li
                      key={step.id}
                      className="flex gap-3 text-sm leading-6 text-base-content/70"
                    >
                      <Typography
                        as="span"
                        variant="caption"
                        weight="bold"
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-base-200"
                      >
                        {step.order}
                      </Typography>
                      <Typography as="span" variant="body-sm" tone="inherit">
                        {step.description}
                      </Typography>
                    </li>
                  ))}
                </ol>
              ) : (
                <Typography
                  as="p"
                  variant="body-sm"
                  tone="muted"
                  className="mt-3"
                >
                  Aucune étape pour le moment.
                </Typography>
              )}
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
