import { RecipeResource } from '@/app/data/resources/recipe/types';
import { RecipeResourceData } from '@/types/generated';
import { ArrowLeft, Clock3, UtensilsCrossed, X } from 'lucide-react';

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
            <p className="mb-2 hidden text-xs font-semibold tracking-wide text-base-content/55 uppercase lg:block">
              Aperçu de la recette
            </p>
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
              <h2
                id="recipe-detail-title"
                className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
              >
                {recipe.name}
              </h2>
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
            <p className="mt-3 max-w-2xl text-sm leading-6 text-base-content/65 sm:mt-4">
              {recipe.description || 'Aucune description disponible.'}
            </p>
            {(recipe.meal_times.length > 0 || recipe.tags.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.meal_times.map((mealTime) => (
                  <span
                    key={mealTime.id}
                    className="badge h-7 bg-secondary/10 px-3 text-secondary"
                  >
                    {mealTime.name}
                  </span>
                ))}
                {recipe.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="badge h-7 border-base-content/30 px-3 text-base-content/75"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <section className="mt-6 flex-1 border-t border-base-300 pt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">Ingrédients</h2>
                <span className="text-xs text-base-content/45">
                  Liste indicative
                </span>
              </div>
              {ingredients.length ? (
                <ul className="mt-3 space-y-0.5">
                  {ingredients.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="flex items-center justify-between gap-3 px-1 py-2 text-sm text-base-content/70"
                    >
                      <span className="truncate">{ingredient.name}</span>
                      <span className="shrink-0">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-base-content/55">
                  Aucun ingrédient pour le moment.
                </p>
              )}
            </section>
            <section className="mt-6 border-t border-base-300 pt-5">
              <h2 className="text-base font-bold">Préparation</h2>
              {steps.length ? (
                <ol className="mt-3 space-y-3">
                  {steps.map((step) => (
                    <li
                      key={step.id}
                      className="flex gap-3 text-sm leading-6 text-base-content/70"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-base-200 text-xs font-bold">
                        {step.order}
                      </span>
                      <span>{step.description}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-base-content/55">
                  Aucune étape pour le moment.
                </p>
              )}
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
