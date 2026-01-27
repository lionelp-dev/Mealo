import DeleteRecipesDialog from '@/components/delete-recipe';
import MealPlanDialogSearchRecipes from '@/components/meal-plan-dialog-search-recipes';
import { RecipeCard } from '@/components/recipe-card';
import { RecipesActiveFilters } from '@/components/recipes-active-filters';
import { RecipesPopoverFilters } from '@/components/recipes-popover-filters';
import { useDeleteRecipesDialog } from '@/hooks/use-delete-recipes-dialog';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import { useUrlFilterSync } from '@/hooks/use-url-filter-sync';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import recipesRoute from '@/routes/recipes';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { PaginatedCollection, Recipe, Tag } from '@/types';
import { Head, InfiniteScroll, router, usePage } from '@inertiajs/react';
import { CookingPot, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
};

export default function Recipes() {
  const { t } = useTranslation();

  const { recipes, tags } = usePage<PageProps>().props;

  useUrlFilterSync();

  const { activeFilters, clearAllFilters } = useRecipeFiltersStore();
  const hasActiveFilter = activeFilters.length > 0;

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipesId,
    clearSelectedRecipes,
  } = useMultiSelectRecipe();

  const { deleteRecipe, deleteRecipes } = useDeleteRecipesDialog();

  return (
    <AppLayout
      headerLeftContent={<MealPlanDialogSearchRecipes />}
      headerRightContent={
        <div className="flex items-center gap-7">
          <button
            className={`btn col-start-4 row-start-1 gap-2 justify-self-end whitespace-nowrap btn-outline btn-secondary ${
              isMultiSelectMode ? 'btn-active' : ''
            }`}
            onClick={() => {
              setIsMultiSelectMode(!isMultiSelectMode);
              if (!isMultiSelectMode) {
                clearSelectedRecipes();
              }
            }}
          >
            Multi-select {/* TODO: Add proper translation key */}
            <Copy size={14} className="mb-[1px]" />
          </button>
          <button
            className="btn gap-2 pl-5 btn-secondary"
            onClick={() => router.get(recipesRoute.create.url())}
          >
            {t('recipes.index.createButton', 'Create recipe')}
            <CookingPot size={15} />
          </button>
        </div>
      }
    >
      <Head title={t('recipes.pageTitle', 'My recipes')}></Head>

      <div className={cn('flex h-full flex-col gap-1 overflow-hidden')}>
        <div
          className={cn(
            'top-0 right-0 left-0 z-10 flex justify-center overflow-hidden bg-base-100',
            hasActiveFilter && 'sticky',
          )}
        >
          <div className="flex w-[92%] items-center justify-end gap-2 py-2.5">
            {hasActiveFilter && (
              <>
                <button
                  onClick={clearAllFilters}
                  className="btn mb-[2px] w-fit flex-shrink-0 items-center gap-2 self-end text-sm whitespace-nowrap text-secondary btn-link underline btn-sm hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t(
                    'mealPlanning.dialog.filters.clearAllFilters',
                    'Clear all filters',
                  )}
                </button>
                <div className="min-w-0 flex-1 overflow-x-auto">
                  <RecipesActiveFilters />
                </div>
              </>
            )}
            <RecipesPopoverFilters
              className="flex-shrink-0 text-secondary btn-link"
              sideOffset={8}
              tags={tags}
            />
          </div>
        </div>

        {/* Empty State */}
        {recipes.data.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-44">
            <CookingPot className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
              {t('recipes.empty.title', 'Aucune recette')}
            </h3>
            <p className="mb-4 max-w-md text-center text-muted-foreground">
              {t(
                'recipes.empty.description',
                "Commencez par créer votre première recette ou utilisez l'IA pour générer des idées de repas.",
              )}
            </p>
          </div>
        )}

        {recipes.data.length > 0 && (
          <div className="mx-auto min-h-0 w-[92%] flex-1 overflow-y-auto">
            <InfiniteScroll data="recipes">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(22rem,100%),1fr)))] gap-x-7 gap-y-10 pb-10">
                {recipes.data.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={deleteRecipe}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}

        {isMultiSelectMode && selectedRecipesId.length > 0 && (
          <div className="fixed bottom-7 left-1/2 z-20 flex -translate-x-1/2 transform">
            <div className="join shadow-2xl">
              <button
                className="btn join-item rounded-l-full border-base-300 text-sm font-medium text-base-content"
                onClick={() => {
                  clearSelectedRecipes();
                  setIsMultiSelectMode(false);
                }}
                disabled={selectedRecipesId.length === 0}
              >
                {t('common.buttons.abandon', 'Cancel')}
              </button>

              <button
                onClick={() => {
                  clearSelectedRecipes();
                }}
                className="btn join-item flex items-center gap-3 border-base-300 px-5"
              >
                <span className="flex items-baseline gap-1.5 text-base-content">
                  <span className="mb-[1px] text-sm font-medium">
                    {t('common.buttons.clearSelection', 'Clear selection')}
                  </span>
                  <span className="text-sm font-medium">
                    ({selectedRecipesId.length})
                  </span>
                </span>
              </button>

              <button
                className="btn join-item rounded-r-full border-base-300 text-error hover:bg-base-300"
                onClick={() => {
                  const selectedRecipes = recipes.data.filter((recipe) =>
                    selectedRecipesId.includes(recipe.id),
                  );
                  deleteRecipes(selectedRecipes);
                }}
                disabled={selectedRecipesId.length === 0}
              >
                {t('common.buttons.remove', 'Remove')}
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteRecipesDialog />
    </AppLayout>
  );
}
