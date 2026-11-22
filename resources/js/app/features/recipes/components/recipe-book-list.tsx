import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { Typography } from '@/app/components/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { InfiniteScroll } from '@inertiajs/react';
import {
  Bookmark,
  Check,
  EllipsisVertical,
  ImageOff,
  Trash2Icon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const {
    isMultiSelectMode,
    selectedRecipeIds,
    startMultiSelect,
    toggleRecipeSelection,
  } = useRecipesMultiSelectStore();

  return (
    <section
      aria-label="Carnet de recettes"
      className="order-2 flex h-full min-h-0 min-w-0 flex-1 flex-col border-r border-base-300/60 bg-base-100 px-3 lg:px-5 lg:pl-6"
    >
      <div className="-mx-3 mb-3 shrink-0 border-b border-base-300/60 bg-base-100 px-3 lg:-mx-5 lg:px-5">
        {controls && (
          <div className="py-3.5">
            <Typography
              as="h2"
              variant="body-2xl"
              tone="secondary"
              className="mb-3 flex items-center gap-2"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-base-200 text-secondary">
                <Bookmark size={19} aria-hidden="true" />
              </span>
              {t('recipes.index.bookTitle', 'My recipe book')}
            </Typography>
            {controls}
          </div>
        )}
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
                  <div
                    key={recipe.id}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      isSelected ? 'bg-base-200/75' : 'hover:bg-base-200/45'
                    }`}
                  >
                    <button
                      type="button"
                      aria-pressed={
                        isMultiSelectMode
                          ? selectedRecipeIds.includes(recipe.id)
                          : isSelected
                      }
                      onClick={() =>
                        isMultiSelectMode
                          ? toggleRecipeSelection(recipe.id)
                          : onSelect(recipe)
                      }
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      {recipe.image_url ? (
                        <img
                          src={recipe.image_url}
                          alt=""
                          className="h-24 w-37 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/35">
                          <ImageOff size={18} />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <Typography
                          as="span"
                          variant="body-sm"
                          tone="inherit"
                          className="flex items-center gap-2"
                        >
                          <Typography
                            as="span"
                            variant="body"
                            tone="inherit"
                            className="truncate"
                          >
                            {recipe.name}
                          </Typography>
                          {isRecentlyAdded && (
                            <Typography
                              as="span"
                              variant="body-sm"
                              weight="semibold"
                              tone="inherit"
                              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-1"
                            >
                              <Check size={12} /> Ajoutée
                            </Typography>
                          )}
                        </Typography>
                        <Typography
                          as="span"
                          variant="body-sm"
                          tone="inherit"
                          className="mt-1 flex flex-wrap gap-1.5"
                        >
                          {recipe.meal_times.map((mealTime) => (
                            <Typography
                              as="span"
                              variant="body-sm"
                              key={mealTime.id}
                              tone="inherit"
                              className="badge"
                            >
                              {t(
                                `mealPlanning.dialog.filters.${mealTime.slug}`,
                                mealTime.name,
                              )}
                            </Typography>
                          ))}
                        </Typography>
                      </span>
                    </button>
                    {isMultiSelectMode ? (
                      <input
                        type="checkbox"
                        checked={selectedRecipeIds.includes(recipe.id)}
                        onChange={() => toggleRecipeSelection(recipe.id)}
                        className="checkbox shrink-0 checkbox-sm checkbox-secondary"
                      />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="btn btn-square shrink-0 btn-ghost btn-sm"
                            aria-label={t(
                              'recipes.actions.openMenu',
                              'Open recipe menu',
                            )}
                          >
                            <EllipsisVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => startMultiSelect(recipe.id)}
                          >
                            <Trash2Icon size={14} />
                            {t('common.buttons.delete', 'Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {recipes.length > 0 && generationStatus}
        </InfiniteScroll>
      </div>
      {footer && (
        <footer className="-mx-3 shrink-0 border-t border-base-300/60 bg-base-100 lg:-mx-5">
          {footer}
        </footer>
      )}
    </section>
  );
}
