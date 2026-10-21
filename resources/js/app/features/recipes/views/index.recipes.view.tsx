import { RecipeBookList } from '../components/recipe-book-list';
import RecipeDetailPanel from '../components/recipe-detail-panel';
import { DiscoveryPausedBanner } from '../components/recipe-discovery/discovery-paused-banner';
import { RecipeDiscoveryPanel } from '../components/recipe-discovery/recipe-discovery-panel';
import { RecipesMultiSelectToolbar } from '../components/recipes-multi-select-toolbar';
import { useDiscoverySession } from '../hooks/use-discovery-session';
import { useRecipesContextValue } from '../inertia.adapter';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { PageContainer } from '@/app/components/page-container';
import { RecipesFilters } from '@/app/components/recipes-filters';
import { RecipesFiltersPopover } from '@/app/components/recipes-filters-popover';
import RecipesSearch from '@/app/components/recipes-search';
import { StarterRecipesNotice } from '@/app/components/starter-recipes-notice';
import { useRecipesRequestCoordination } from '@/app/hooks/use-recipes-request-coordination';
import AppLayout from '@/app/layouts/app-layout';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { useRecipesSearchStore } from '@/app/stores/use-recipes-search-store';
import { capitalize } from '@/app/utils';
import recipesRoute from '@/routes/recipes';
import { Head, router, usePoll } from '@inertiajs/react';
import { ChefHatIcon, Sparkles, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function IndexRecipesView() {
  const { t } = useTranslation();
  const {
    recipes,
    selected_recipe,
    meal_times,
    url,
    tags,
    starterRecipes,
    recipeGeneration,
  } = useRecipesContextValue();
  const { activeFilters, clearAllFilters, removeFilter } =
    useRecipesFiltersStore();
  const { searchTerm } = useRecipesSearchStore();
  const { triggerRecipesRequest } = useRecipesRequestCoordination();
  const isInitialRender = useRef(true);
  const multiSelect = useRecipesMultiSelectStore();
  const recipeItems = recipes?.data ?? [];
  const discovery = useDiscoverySession(recipeItems, selected_recipe);
  const isGeneratingRecipes =
    !!recipeGeneration?.generating || !!starterRecipes?.generating;
  const isGeneratingStarterRecipes = !!starterRecipes?.generating;
  const isUnfilteredRecipeList =
    activeFilters.length === 0 && searchTerm.trim() === '';
  const { start, stop } = usePoll(
    3000,
    {
      only: ['recipes', 'starterRecipes', 'recipeGeneration'],
      reset: ['recipes'],
    },
    { autoStart: false },
  );

  useEffect(() => {
    if (isGeneratingRecipes) start();
    else stop();
  }, [isGeneratingRecipes, start, stop]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    triggerRecipesRequest();
    // `triggerRecipesRequest` is recreated by its coordination hook. Depending
    // on it would turn every local selection render into another Inertia visit.
  }, [activeFilters]);

  useEffect(() => () => multiSelect.resetStore(), [url]);

  if (!recipes) return null;

  const toggleDiscovery = () => {
    if (discovery.isDiscovering || discovery.hasPausedDiscovery) {
      discovery.quitDiscovery();
      return;
    }
    multiSelect.clearSelectedRecipes();
    multiSelect.setIsMultiSelectMode(false);
    discovery.startDiscovery();
  };

  return AppLayout({
    headerRightContent: (
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3 max-lg:gap-1.5">
        <button
          className="btn gap-2 btn-outline btn-secondary max-md:btn-sm"
          onClick={toggleDiscovery}
        >
          <Sparkles className="h-4 w-4" />
          {discovery.isDiscovering || discovery.hasPausedDiscovery ? (
            'Quitter la découverte'
          ) : (
            <>
              <span className="lg:hidden">Découvrir avec l’IA</span>
              <span className="max-lg:hidden">
                Découvrir des recettes avec l’IA
              </span>
            </>
          )}
        </button>
        <button
          className="btn gap-2 btn-secondary max-md:btn-sm min-md:pl-5.5"
          onClick={() => router.get(recipesRoute.create.url())}
        >
          {t('recipes.index.createButton', 'Create recipe')}
          <ChefHatIcon className="h-4 w-auto max-md:hidden" />
        </button>
      </div>
    ),
    children: (
      <>
        <Head title={t('recipes.pageTitle', 'My recipes')} />
        <PageContainer
          size="full"
          className="py-0"
          contentClassName="flex min-h-0 w-full flex-1 flex-col px-0!"
        >
          {discovery.hasPausedDiscovery && (
            <DiscoveryPausedBanner onResume={discovery.resumeDiscovery} />
          )}
          <div className="relative grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1fr_1.975fr]">
            <div
              className={
                discovery.isDiscovering
                  ? 'absolute inset-0 z-20 flex min-h-0 flex-col bg-base-100 shadow-2xl lg:contents'
                  : 'hidden'
              }
            >
              <RecipeDiscoveryPanel
                key={discovery.sessionKey}
                onSaved={discovery.savedRecipe}
                onPendingChange={discovery.setPendingCount}
                onGeneratingChange={discovery.setIsPoolGenerating}
                onPreparationChange={discovery.setHasPreparation}
                mealTimes={meal_times ?? []}
                onClose={discovery.quitDiscovery}
              />
            </div>
            {!discovery.isDiscovering &&
              (discovery.selectedRecipe ? (
                <div className="absolute inset-0 z-20 min-h-0 bg-base-100 shadow-2xl lg:contents">
                  <RecipeDetailPanel
                    recipe={discovery.selectedRecipe}
                    onClose={discovery.closeSelectedRecipe}
                    showDesktopCloseButton={false}
                  />
                </div>
              ) : (
                <section className="hidden min-h-64 items-center justify-center px-6 py-12 text-center lg:flex">
                  <div>
                    <p className="text-lg font-semibold">
                      Choisissez une recette
                    </p>
                    <p className="mt-2 text-sm text-base-content/55">
                      Sélectionnez une recette dans votre carnet pour voir ses
                      détails.
                    </p>
                  </div>
                </section>
              ))}
            <div className="flex min-h-0 flex-col overflow-hidden lg:col-start-1 lg:row-start-1">
              <RecipeBookList
                recipes={recipes.data}
                selectedRecipeId={discovery.selectedRecipe?.id ?? null}
                recentlyAddedRecipeId={discovery.recentlyAddedRecipeId}
                onSelect={discovery.selectRecipe}
                emptyContent={
                  isGeneratingStarterRecipes && isUnfilteredRecipeList ? (
                    <StarterRecipesNotice />
                  ) : undefined
                }
                generationStatus={
                  isGeneratingStarterRecipes ? (
                    <StarterRecipesNotice variant="inline" />
                  ) : undefined
                }
                controls={
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2.5">
                    <RecipesSearch className="min-w-0" />
                    <RecipesFiltersPopover
                      tags={tags ?? []}
                      label="Filtres"
                      compact
                      className="min-w-0"
                    />
                    <RecipesFilters
                      className="col-span-2 min-w-0"
                      showActiveFilters={false}
                      showReset={false}
                    />
                    {activeFilters.some(
                      (filter) => filter.type !== 'meal_time',
                    ) && (
                      <div className="col-span-2 flex min-w-0 items-center justify-between gap-3">
                        <div className="flex max-h-[4.5rem] min-w-0 flex-wrap content-start items-center gap-2 overflow-hidden">
                          {activeFilters
                            .filter((filter) => filter.type !== 'meal_time')
                            .map((filter) => (
                              <button
                                key={`${filter.type}-${filter.value}`}
                                type="button"
                                onClick={() => removeFilter(filter)}
                                className="badge h-8 max-w-40 gap-1.5 border-0 bg-secondary/10 px-3 text-sm font-normal text-secondary"
                              >
                                <span className="truncate">
                                  {filter.type === 'preparation_time' &&
                                    t(
                                      'mealPlanning.dialog.filters.prep',
                                      'Prep: ',
                                    )}
                                  {filter.type === 'cooking_time' &&
                                    t(
                                      'mealPlanning.dialog.filters.cook',
                                      'Cook: ',
                                    )}
                                  {capitalize(filter.label)}
                                </span>
                                <X size={14} className="shrink-0" />
                              </button>
                            ))}
                        </div>
                        <button
                          onClick={clearAllFilters}
                          className="btn h-fit shrink-0 p-0 text-secondary btn-link"
                        >
                          Effacer les filtres
                        </button>
                      </div>
                    )}
                  </div>
                }
                footer={
                  !discovery.isDiscovering && multiSelect.isMultiSelectMode ? (
                    <RecipesMultiSelectToolbar />
                  ) : undefined
                }
              />
            </div>
          </div>
        </PageContainer>
      </>
    ),
  });
}
