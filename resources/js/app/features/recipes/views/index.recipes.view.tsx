import { RecipeAIGenerationPopover } from '../components/recipe-ai-generation-popover';
import { RecipeCard } from '../components/recipe-card';
import { RecipeCardSkeleton } from '../components/recipe-card-skeleton';
import RecipeDetailPanel from '../components/recipe-detail-panel';
import RecipeDetailPanelContainer from '../components/recipe-detail-panel-container';
import { RecipesMultiSelectToolbar } from '../components/recipes-multi-select-toolbar';
import { useRecipeDetailPanel } from '../hooks/use-recipe-detail-panel';
import { useRecipesContextValue } from '../inertia.adapter';
import { editRecipe } from '../repositories/recipes.repository';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { RecipesFilters } from '@/app/components/recipes-filters';
import { RecipesFiltersPopover } from '@/app/components/recipes-filters-popover';
import RecipesSearch from '@/app/components/recipes-search';
import { StarterRecipesNotice } from '@/app/components/starter-recipes-notice';
import { usePermissions } from '@/app/hooks/use-permissions';
import { useRecipesRequestCoordination } from '@/app/hooks/use-recipes-request-coordination';
import AppLayout from '@/app/layouts/app-layout';
import { cn } from '@/app/lib';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import recipesRoute from '@/routes/recipes';
import { Head, InfiniteScroll, router, usePoll } from '@inertiajs/react';
import { ChefHatIcon, CookingPot, Copy } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function IndexRecipesView() {
  const { t } = useTranslation();

  const {
    recipes,
    selected_recipe,
    url,
    meal_times,
    starterRecipes,
    recipeGeneration,
  } = useRecipesContextValue();

  const isGeneratingStarterRecipes = !!starterRecipes?.generating;
  const isGeneratingRecipes = !!recipeGeneration?.generating;
  const pendingStarterRecipeSkeletonCount =
    recipes && recipes.data.length > 0 ? (starterRecipes?.count ?? 0) : 0;
  const pendingRecipeSkeletonCount =
    (recipeGeneration?.count ?? 0) + pendingStarterRecipeSkeletonCount;
  const hasPendingRecipeSkeletons = pendingRecipeSkeletonCount > 0;

  const { activeFilters, clearAllFilters } = useRecipesFiltersStore();
  const { triggerRecipesRequest } = useRecipesRequestCoordination();
  const { canEditRecipe } = usePermissions();
  const isInitialRender = useRef(true);
  const {
    setSelectedRecipe,
    displayedRecipe,
    isRecipeDetailMounted,
    isRecipeDetailVisible,
    closeRecipeDetail,
  } = useRecipeDetailPanel(selected_recipe);

  // Keep this page fresh while recipes are generated in the background.
  const { start: startRecipeGenerationPoll, stop: stopRecipeGenerationPoll } =
    usePoll(
      3000,
      {
        only: ['recipes', 'starterRecipes', 'recipeGeneration'],
        reset: ['recipes'],
      },
      { autoStart: false },
    );
  useEffect(() => {
    if (isGeneratingStarterRecipes || isGeneratingRecipes) {
      startRecipeGenerationPoll();
    } else {
      stopRecipeGenerationPoll();
    }
  }, [
    isGeneratingStarterRecipes,
    isGeneratingRecipes,
    startRecipeGenerationPoll,
    stopRecipeGenerationPoll,
  ]);

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
    const nextIsMultiSelectMode = !isMultiSelectMode;

    setIsMultiSelectMode(nextIsMultiSelectMode);
    if (!nextIsMultiSelectMode) {
      clearSelectedRecipes();
    }
  };

  const { tags } = useRecipesContextValue();

  if (!recipes) return null;

  return AppLayout({
    headerLeftContent: <RecipesSearch className="max-lg:hidden" />,
    headerRightContent: (
      <div className="flex flex-1 items-center justify-end gap-3">
        <RecipeAIGenerationPopover
          className="max-md:hidden"
          meal_times={meal_times ?? []}
        />
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
        <div className="flex h-full min-h-0 w-full max-w-full min-w-0 flex-col overflow-x-clip overflow-y-hidden">
          <div
            className={
              'z-10 mx-auto grid h-fit w-full min-w-0 gap-3 px-6 py-3 pb-2.5 pl-7.5 lg:grid-cols-[minmax(0,1fr)_auto]'
            }
          >
            <RecipesSearch className="min-lg:hidden" />
            <RecipesFilters />
            <div className="flex h-fit min-w-0 items-start gap-2.5 lg:justify-end">
              <RecipesFiltersPopover
                tags={tags ?? []}
                className="min-w-0 flex-1 lg:flex-none"
              />
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className={`btn ml-auto h-fit max-w-36 min-w-0 shrink-0 items-center gap-1.5 self-center p-0 text-secondary btn-link lg:hidden`}
                >
                  <span className="min-w-0 truncate">
                    {t(
                      'mealPlanning.dialog.filters.clearAllFilters',
                      'Clear all filters',
                    )}
                  </span>
                </button>
              )}

              <button
                className={cn(
                  `btn min-w-0 flex-1 gap-2 border border-secondary/40 whitespace-nowrap btn-outline btn-soft btn-secondary max-md:hidden lg:flex-none`,
                  isMultiSelectMode ? 'btn-active' : '',
                )}
                onClick={handleToggleMultiSelect}
              >
                <span className="min-w-0 truncate">
                  {t('recipes.multiSelect.toggle', 'Multiple selection')}
                </span>
                <Copy size={14} className="mb-[1px] shrink-0" />
              </button>
            </div>
          </div>

          {/* Empty State */}
          {recipes.data.length === 0 && !isGeneratingRecipes && (
            <div className="flex flex-col items-center justify-center pt-44">
              {isGeneratingStarterRecipes ? (
                <StarterRecipesNotice />
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          {(recipes.data.length > 0 || isGeneratingRecipes) && (
            <div className="flex min-h-0 flex-1 gap-3 overflow-hidden pr-6 pl-7.5">
              <div className="min-h-0 w-full min-w-0 overflow-y-auto">
                <InfiniteScroll data="recipes">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr)))] gap-x-7 gap-y-10 pt-1 pb-10">
                    {hasPendingRecipeSkeletons &&
                      Array.from({ length: pendingRecipeSkeletonCount }).map(
                        (_, index) => <RecipeCardSkeleton key={index} />,
                      )}
                    {recipes.data.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onViewRecipe={setSelectedRecipe}
                      />
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
              <RecipeDetailPanelContainer
                isMounted={isRecipeDetailMounted}
                isVisible={isRecipeDetailVisible}
              >
                {displayedRecipe && (
                  <RecipeDetailPanel
                    recipe={displayedRecipe}
                    onClose={closeRecipeDetail}
                    onEdit={
                      canEditRecipe(displayedRecipe.user_id)
                        ? () => editRecipe(displayedRecipe.id)
                        : undefined
                    }
                  />
                )}
              </RecipeDetailPanelContainer>
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
