import type { DiscoveryProgress } from '../../hooks/use-discovery-session';
import {
  type RecipeDiscoveryCriteria,
  useRecipeDiscovery,
} from '../../hooks/use-recipe-discovery';
import { RecipeDiscoveryCriteriaScreen } from './recipe-discovery-criteria-screen';
import { RecipeDiscoveryResultScreen } from './recipe-discovery-result-screen';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import { useAppForm } from '@/app/hooks/form-hook';
import { useStore } from '@tanstack/react-form';
import { useEffect } from 'react';

type Props = {
  mealTimes: MealTimeResource[];
  onRecipeSaved: (recipeId: string) => void;
  onProgressChange: (progress: DiscoveryProgress) => void;
};

const defaultCriteria: RecipeDiscoveryCriteria = {
  prompt: '',
  diet: null,
  styles: [],
  effort: null,
  mealTimes: [],
};

function useRecipeDiscoveryCriteriaForm(
  onSubmit: (criteria: RecipeDiscoveryCriteria) => void,
) {
  return useAppForm({
    defaultValues: defaultCriteria,
    onSubmit: ({ value }) => onSubmit(value),
  });
}

export type RecipeDiscoveryCriteriaForm = ReturnType<
  typeof useRecipeDiscoveryCriteriaForm
>;

export function RecipeDiscoveryPanel(props: Props) {
  const { mealTimes, onProgressChange, onRecipeSaved } = props;
  const discovery = useRecipeDiscovery({
    onRecipeSaved,
  });
  const form = useRecipeDiscoveryCriteriaForm(discovery.generateRecipes);
  const criteria = useStore(form.store, (state) => state.values);
  const isDirty = useStore(form.store, (state) => state.isDirty);

  useEffect(() => {
    onProgressChange({
      pendingCount: discovery.pendingCount,
      isGenerating: discovery.isGenerating || discovery.isPrefetching,
      hasUnsavedChanges: isDirty,
    });
  }, [
    discovery.isGenerating,
    discovery.isPrefetching,
    discovery.pendingCount,
    isDirty,
    onProgressChange,
  ]);

  if (!discovery.currentRecipe || discovery.isRefining) {
    return (
      <RecipeDiscoveryCriteriaScreen
        mealTimes={mealTimes}
        form={form}
        isLoading={discovery.isGenerating || discovery.isPrefetching}
        error={discovery.error}
        onRetry={() => discovery.retryGeneration(criteria)}
      />
    );
  }

  return (
    <RecipeDiscoveryResultScreen
      recipe={discovery.currentRecipe}
      mealTimes={mealTimes}
      diet={criteria.diet}
      selectedMealTimeSlugs={criteria.mealTimes}
      isSaving={discovery.isSaving}
      error={discovery.error}
      onRefine={() => discovery.setIsRefining(true)}
      onSave={discovery.saveRecipe}
      onSkip={discovery.skipRecipe}
      onRetry={() => discovery.retryGeneration(criteria)}
    />
  );
}
