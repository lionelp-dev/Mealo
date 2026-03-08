import { useRecipesContextValue } from '../infrastructure/inertia.adapter';
import { useRecipesMultiSelectStore } from '../infrastructure/stores/use-recipes-multi-select-store';
import { RecipeCard } from './components/recipe-card';
import { RecipesMultiSelectToolbar } from './components/recipes-multi-select-toolbar';
import AppLayout from '@/layouts/app-layout';
import recipesRoute from '@/routes/recipes';
import { RecipesFilters } from '@/shared/components/recipes-filters';
import RecipesSearch from '@/shared/components/recipes-search';
import { useRecipesRequestCoordination } from '@/shared/hooks/use-recipes-request-coordination';
import { useRecipesFiltersStore } from '@/shared/stores/recipes-filters-store';
import { Recipe } from '@/types';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { ChefHatIcon, CookingPot, Copy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function RecipesIndexPage() {
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
              'z-10 mx-auto flex h-fit w-full justify-between gap-4 px-6 py-3 pb-2.5 pl-7.5'
            }
          >
            <RecipesFilters />
            <button
              className={`btn col-start-4 row-start-1 gap-2 justify-self-end border border-secondary/40 whitespace-nowrap btn-outline btn-soft btn-secondary ${
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
            <div className="mx-auto min-h-0 flex-1 overflow-y-auto pr-6 pl-7.5">
              <InfiniteScroll data="recipes">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(22rem,100%),1fr)))] gap-x-7 gap-y-10 pb-10">
                  {recipes.data.map((recipe: Recipe) => (
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
