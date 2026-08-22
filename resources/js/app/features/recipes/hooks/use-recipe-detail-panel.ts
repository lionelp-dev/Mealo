import { RecipeResourceData } from '@/types/generated';
import { useEffect, useRef, useState } from 'react';

export function useRecipeDetailPanel(
  initialRecipe?: RecipeResourceData | null,
) {
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeResourceData | null>(initialRecipe ?? null);
  const [isRecipeDetailMounted, setIsRecipeDetailMounted] =
    useState(!!initialRecipe);
  const [isRecipeDetailVisible, setIsRecipeDetailVisible] =
    useState(!!initialRecipe);

  // Keep the last recipe mounted so its content stays visible while the panel
  // animates closed.
  const lastRecipeRef = useRef<RecipeResourceData | null>(
    initialRecipe ?? null,
  );
  if (selectedRecipe) {
    lastRecipeRef.current = selectedRecipe;
  }
  const displayedRecipe = selectedRecipe ?? lastRecipeRef.current;

  useEffect(() => {
    if (initialRecipe) {
      setSelectedRecipe(initialRecipe);
    }
  }, [initialRecipe]);

  useEffect(() => {
    if (selectedRecipe) {
      setIsRecipeDetailMounted(true);
      const animationFrameId = window.requestAnimationFrame(() => {
        setIsRecipeDetailVisible(true);
      });

      return () => window.cancelAnimationFrame(animationFrameId);
    }

    setIsRecipeDetailVisible(false);

    if (!isRecipeDetailMounted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsRecipeDetailMounted(false);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isRecipeDetailMounted, selectedRecipe]);

  return {
    selectedRecipe,
    setSelectedRecipe,
    displayedRecipe,
    isRecipeDetailMounted,
    isRecipeDetailVisible,
    closeRecipeDetail: () => setSelectedRecipe(null),
  };
}
