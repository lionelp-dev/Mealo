import DeleteRecipesDialog from '@/components/delete-recipe';
import MealPlanDialogSearchRecipes from '@/components/meal-plan-dialog-search-recipes';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeFilters } from '@/components/recipe-filters';
import { RecipeFiltersDataProvider } from '@/contexts/recipe-filters-context';
import { useDeleteRecipesDialog } from '@/hooks/use-delete-recipes-dialog';
import { useMultiSelectRecipe } from '@/hooks/use-multi-select-recipe';
import AppLayout from '@/layouts/app-layout';
import recipesRoute from '@/routes/recipes';
import { PaginatedCollection, Recipe, Tag } from '@/types';
import { Head, InfiniteScroll, router, usePage } from '@inertiajs/react';
import { ChefHatIcon, CookingPot, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
};

export default function Recipes() {
  const { recipes, tags } = usePage<PageProps>().props;
  return (
    <RecipeFiltersDataProvider data={{ recipes, tags }}>
      <RecipesView />
    </RecipeFiltersDataProvider>
  );
}

function RecipesView() {
  const { t } = useTranslation();

  const { recipes } = usePage<PageProps>().props;

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipesId,
    clearSelectedRecipes,
  } = useMultiSelectRecipe();

  const { deleteRecipe, deleteRecipes } = useDeleteRecipesDialog();

  return AppLayout({
    children: (
      <>
        <Head title={t('recipes.pageTitle', 'My recipes')}></Head>
        <div className={'flex h-full min-h-0 flex-col overflow-hidden'}>
          <div
            className={
              'z-10 mx-auto flex h-fit w-[92%] justify-between gap-4 py-3 pb-2.5'
            }
          >
            <RecipeFilters />
            <button
              className={`btn col-start-4 row-start-1 gap-2 justify-self-end border border-secondary/40 whitespace-nowrap btn-outline btn-soft btn-secondary ${
                isMultiSelectMode ? 'btn-active' : ''
              }`}
              onClick={() => {
                setIsMultiSelectMode(!isMultiSelectMode);
                if (!isMultiSelectMode) {
                  clearSelectedRecipes();
                }
              }}
            >
              <span>Selection multiple</span>
              <Copy size={14} className="mb-[1px]" />
            </button>
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
            <div className="mx-auto min-h-0 w-[92%] flex-1 overflow-y-auto pt-1">
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
      </>
    ),
    headerLeftContent: <MealPlanDialogSearchRecipes />,
    headerRightContent: (
      <div className="flex items-center gap-7">
        <button
          className="btn gap-2 pl-5.5 btn-secondary"
          onClick={() => router.get(recipesRoute.create.url())}
        >
          {t('recipes.index.createButton', 'Create recipe')}
          <ChefHatIcon size={15} />
        </button>
      </div>
    ),
  });
}
