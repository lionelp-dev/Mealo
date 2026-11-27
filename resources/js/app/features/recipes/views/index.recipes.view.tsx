import { RecipeDetailsPanel } from '../components/recipe-details-panel';
import { DiscoveryPausedBanner } from '../components/recipe-discovery/discovery-paused-banner';
import { RecipeDiscoveryPanel } from '../components/recipe-discovery/recipe-discovery-panel';
import { RecipesBookPanel } from '../components/recipes-book-panel';
import { useDiscoverySession } from '../hooks/use-discovery-session';
import { useRecipesFiltersRequest } from '../hooks/use-recipes-filters-request';
import { useResetRecipesMultiSelectOnNavigation } from '../hooks/use-reset-recipes-multi-select-on-navigation';
import { useRecipesContextValue } from '../inertia.adapter';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { Typography } from '@/app/components/Typography';
import { PageContainer } from '@/app/components/page-container';
import AppLayout from '@/app/layouts/app-layout';
import recipesRoute from '@/routes/recipes';
import { Head, router, usePoll } from '@inertiajs/react';
import { ChefHatIcon, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function IndexRecipesView() {
  const { t } = useTranslation();
  const {
    recipes,
    selected_recipe: selectedRecipe,
    meal_times: mealTimes,
    url,
    tags,
    starterRecipes,
    recipeGeneration,
  } = useRecipesContextValue();
  const { clearSelectedRecipes, setIsMultiSelectMode } =
    useRecipesMultiSelectStore.getState();
  const recipeItems = recipes?.data ?? [];
  const discovery = useDiscoverySession(recipeItems, selectedRecipe);
  const isGeneratingRecipes =
    !!recipeGeneration?.generating || !!starterRecipes?.generating;
  const isGeneratingStarterRecipes = !!starterRecipes?.generating;

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

  useRecipesFiltersRequest();
  useResetRecipesMultiSelectOnNavigation(url);

  if (!recipes) return null;

  const toggleDiscovery = () => {
    if (discovery.isDiscovering || discovery.canResume) {
      discovery.quit();
      return;
    }

    clearSelectedRecipes();
    setIsMultiSelectMode(false);
    discovery.start();
  };

  return (
    <AppLayout
      headerRightContent={
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3 max-lg:gap-1.5">
          <button
            type="button"
            className="btn gap-2 btn-outline btn-secondary max-md:btn-sm"
            onClick={toggleDiscovery}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {discovery.isDiscovering || discovery.canResume ? (
              t('recipes.index.quitDiscovery', 'Quit discovery')
            ) : (
              <>
                <Typography
                  as="span"
                  variant="body-sm"
                  tone="inherit"
                  className="lg:hidden"
                >
                  {t('recipes.index.discoverShort', 'Discover with AI')}
                </Typography>
                <Typography
                  as="span"
                  variant="body-sm"
                  tone="inherit"
                  className="max-lg:hidden"
                >
                  {t('recipes.index.discover', 'Discover recipes with AI')}
                </Typography>
              </>
            )}
          </button>
          <button
            type="button"
            className="btn gap-2 btn-secondary max-md:btn-sm min-md:pl-5.5"
            onClick={() => router.get(recipesRoute.create.url())}
          >
            {t('recipes.index.createButton', 'Create recipe')}
            <ChefHatIcon
              className="h-4 w-auto max-md:hidden"
              aria-hidden="true"
            />
          </button>
        </div>
      }
    >
      <Head title={t('recipes.pageTitle', 'My recipes')} />
      <PageContainer
        size="full"
        className="py-0"
        contentClassName="flex min-h-0 w-full flex-1 flex-col px-0!"
      >
        {discovery.canResume && (
          <DiscoveryPausedBanner onResume={discovery.resume} />
        )}
        <div className="relative grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1fr_2.5fr]">
          <RecipesBookPanel
            recipes={recipes.data}
            tags={tags ?? []}
            mealTimes={mealTimes ?? []}
            selectedRecipeId={discovery.selectedRecipe?.id ?? null}
            recentlyAddedRecipeId={discovery.recentlyAddedRecipeId}
            isDiscovering={discovery.isDiscovering}
            isGeneratingStarterRecipes={isGeneratingStarterRecipes}
            onSelectRecipe={discovery.selectRecipe}
          />
          {discovery.isDiscovering ? (
            <div className="absolute inset-0 z-20 flex min-h-0 flex-col bg-base-100 shadow-2xl lg:contents">
              <RecipeDiscoveryPanel
                key={discovery.sessionKey}
                onRecipeSaved={discovery.saveRecipe}
                onProgressChange={discovery.updateProgress}
                mealTimes={mealTimes ?? []}
              />
            </div>
          ) : (
            <RecipeDetailsPanel
              recipe={discovery.selectedRecipe}
              onCloseRecipe={discovery.closeRecipe}
            />
          )}
        </div>
      </PageContainer>
    </AppLayout>
  );
}
