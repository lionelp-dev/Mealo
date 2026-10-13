import { RecipeResource } from '@/app/data/resources/recipe/types';
import { useEffect, useMemo, useState } from 'react';

const isDesktopViewport = () =>
  typeof window === 'undefined' ||
  window.matchMedia?.('(min-width: 1024px)').matches !== false;

export function useDiscoverySession(
  recipes: RecipeResource[],
  initialRecipe?: RecipeResource | null,
) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
    isDesktopViewport() ? (initialRecipe?.id ?? recipes[0]?.id ?? null) : null,
  );
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [canReturnToDiscovery, setCanReturnToDiscovery] = useState(false);
  const [recipeIdBeforeDiscovery, setRecipeIdBeforeDiscovery] = useState<
    string | null
  >(null);
  const [hasPreparation, setHasPreparation] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isPoolGenerating, setIsPoolGenerating] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [recentlyAddedRecipeId, setRecentlyAddedRecipeId] = useState<
    string | null
  >(null);

  const selectedRecipe = useMemo(
    () =>
      isDiscovering
        ? null
        : selectedRecipeId
          ? (recipes.find((recipe) => recipe.id === selectedRecipeId) ?? null)
          : null,
    [isDiscovering, recipes, selectedRecipeId],
  );

  useEffect(() => {
    if (!recentlyAddedRecipeId) return;
    const timeout = window.setTimeout(
      () => setRecentlyAddedRecipeId(null),
      5000,
    );
    return () => window.clearTimeout(timeout);
  }, [recentlyAddedRecipeId]);

  const hasPausedDiscovery =
    !isDiscovering &&
    canReturnToDiscovery &&
    (pendingCount > 0 || isPoolGenerating);

  const startDiscovery = () => {
    setRecipeIdBeforeDiscovery(selectedRecipe?.id ?? null);
    setCanReturnToDiscovery(true);
    setIsDiscovering(true);
  };

  const quitDiscovery = () => {
    if (
      hasPreparation &&
      !window.confirm(
        'Quitter la découverte abandonnera votre demande et vos critères. Continuer ?',
      )
    ) {
      return;
    }
    setCanReturnToDiscovery(false);
    setPendingCount(0);
    setIsPoolGenerating(false);
    setHasPreparation(false);
    setIsDiscovering(false);
    setSelectedRecipeId(
      isDesktopViewport()
        ? (recipeIdBeforeDiscovery ?? recipes[0]?.id ?? null)
        : null,
    );
    setRecipeIdBeforeDiscovery(null);
    setSessionKey((key) => key + 1);
  };

  const selectRecipe = (recipe: RecipeResource) => {
    setSelectedRecipeId(recipe.id);
    if (isDiscovering) setCanReturnToDiscovery(true);
    setIsDiscovering(false);
  };

  const savedRecipe = (recipeId: string) => {
    setRecentlyAddedRecipeId(recipeId);
    setSelectedRecipeId(recipeId);
  };

  return {
    selectedRecipe,
    isDiscovering,
    hasPausedDiscovery,
    recentlyAddedRecipeId,
    sessionKey,
    startDiscovery,
    quitDiscovery,
    resumeDiscovery: () => setIsDiscovering(true),
    selectRecipe,
    closeSelectedRecipe: () => setSelectedRecipeId(null),
    savedRecipe,
    setPendingCount,
    setIsPoolGenerating,
    setHasPreparation,
  };
}
