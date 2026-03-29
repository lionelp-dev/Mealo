import { RecipeCard } from '../components/recipe-card';
import { RecipesMultiSelectToolbar } from '../components/recipes-multi-select-toolbar';
import { useRecipesContextValue } from '../inertia.adapter';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { RecipesFilters } from '@/app/components/recipes-filters';
import { RecipesFiltersPopover } from '@/app/components/recipes-filters-popover';
import RecipesSearch from '@/app/components/recipes-search';
import { useRecipesRequestCoordination } from '@/app/hooks/use-recipes-request-coordination';
import AppLayout from '@/app/layouts/app-layout';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import recipesRoute from '@/routes/recipes';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { ChefHatIcon, CookingPot, Copy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function IndexRecipesView() {
  const { t } = useTranslation();

  const { recipes, url } = useRecipesContextValue();

  const { activeFilters } = useRecipesFiltersStore();
  const { triggerRecipesRequest } = useRecipesRequestCoordination();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    triggerRecipesRequest();
  }, [activeFilters]);

  const recipesMultiSelectStore = useRecipesMultiSelectStore();
  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipeIds,
    clearSelectedRecipes,
  } = recipesMultiSelectStore;

  useEffect(() => {
    return () => {
      recipesMultiSelectStore.resetStore();
    };
  }, [url]);

  const handleNavigateToCreateRecipe = () => {
    router.get(recipesRoute.create.url());
  };

  const handleToggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (!isMultiSelectMode) {
      clearSelectedRecipes();
    }
  };

  const { tags } = useRecipesContextValue();

  return AppLayout({
    headerLeftContent: <RecipesSearch />,
    headerRightContent: (
      <div className="flex items-center gap-7">
        <button
          className="btn gap-2 pl-5.5 btn-secondary"
          onClick={handleNavigateToCreateRecipe}
        >
          {t('recipes.index.createButton', 'Create recipe')}
          <ChefHatIcon size={15} />
        </button>
      </div>
    ),
    children: (
      <>
        <Head title={t('recipes.pageTitle', 'My recipes')}></Head>
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div
            className={
              'z-10 mx-auto grid h-fit w-full justify-between gap-4 px-6 py-3 pb-2.5 pl-7.5 md:grid-cols-2'
            }
          >
            <RecipesFilters />
            <div className="flex h-fit flex-wrap items-start gap-2.5 md:justify-end">
              <RecipesFiltersPopover tags={tags} />
              <button
                className={`btn col-start-4 row-start-1 gap-2 border border-secondary/40 whitespace-nowrap btn-outline btn-soft btn-secondary ${
                  isMultiSelectMode ? 'btn-active' : ''
                }`}
                onClick={handleToggleMultiSelect}
              >
                <span>
                  {t('recipes.multiSelect.toggle', 'Multiple selection')}
                </span>
                <Copy size={14} className="mb-[1px]" />
              </button>
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
            <div className="mx-auto min-h-0 w-full flex-1 overflow-y-auto pr-6 pl-7.5">
              <InfiniteScroll data="recipes">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(22rem,100%),1fr)))] gap-x-7 gap-y-10 pb-10">
                  {recipes.data.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
        {isMultiSelectMode && selectedRecipeIds.length > 0 && (
          <RecipesMultiSelectToolbar />
        )}
      </>
    ),
  });
}
