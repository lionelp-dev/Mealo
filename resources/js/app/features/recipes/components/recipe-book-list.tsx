import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { InfiniteScroll } from '@inertiajs/react';
import { Check, ImageOff } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  recipes: RecipeResource[];
  selectedRecipeId: string | null;
  recentlyAddedRecipeId: string | null;
  onSelect: (recipe: RecipeResource) => void;
  controls?: ReactNode;
  footer?: ReactNode;
  emptyContent?: ReactNode;
  generationStatus?: ReactNode;
};

export function RecipeBookList({
  recipes,
  selectedRecipeId,
  recentlyAddedRecipeId,
  onSelect,
  controls,
  footer,
  emptyContent,
  generationStatus,
}: Props) {
  const { isMultiSelectMode, selectedRecipeIds, toggleRecipeSelection } =
    useRecipesMultiSelectStore();

  return (
    <section
      aria-label="Carnet de recettes"
      className="order-2 flex h-full min-h-0 min-w-0 flex-1 flex-col border-r border-base-300/60 bg-base-100 px-3 lg:px-5 lg:pl-6"
    >
      <div className="-mx-3 mb-3 shrink-0 border-b border-base-300/60 bg-base-100 px-3 lg:-mx-5 lg:px-5">
        {controls && <div className="py-3.5">{controls}</div>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <InfiniteScroll data="recipes">
          {recipes.length === 0 ? (
            (emptyContent ?? (
              <div className="rounded-xl border border-dashed border-base-300 px-5 py-10 text-center text-sm text-base-content/60">
                Aucune recette pour le moment.
              </div>
            ))
          ) : (
            <div className="divide-y divide-base-200">
              {recipes.map((recipe) => {
                const isSelected = selectedRecipeId === recipe.id;
                const isRecentlyAdded = recentlyAddedRecipeId === recipe.id;
                return (
                  <button
                    key={recipe.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      isMultiSelectMode
                        ? toggleRecipeSelection(recipe.id)
                        : onSelect(recipe)
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      isSelected ? 'bg-base-200/75' : 'hover:bg-base-200/45'
                    }`}
                  >
                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt=""
                        className="aspect-video w-40 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/35">
                        <ImageOff size={18} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">
                          {recipe.name}
                        </span>
                        {isRecentlyAdded && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[11px] font-semibold text-success">
                            <Check size={12} /> Ajoutée
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-base-content/55">
                        Recette ·{' '}
                        {recipe.preparation_time + recipe.cooking_time} min
                      </span>
                    </span>
                    {isMultiSelectMode && (
                      <input
                        type="checkbox"
                        checked={selectedRecipeIds.includes(recipe.id)}
                        readOnly
                        className="checkbox shrink-0 checkbox-sm checkbox-secondary"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {recipes.length > 0 && generationStatus}
        </InfiniteScroll>
      </div>
      <footer className="-mx-3 flex shrink-0 items-center justify-between border-t border-base-300/60 bg-base-100 px-3 py-2 lg:-mx-5 lg:px-5">
        <span className="text-sm text-base-content/55">
          {recipes.length} recette{recipes.length > 1 ? 's' : ''}
        </span>
        {footer}
      </footer>
    </section>
  );
}
