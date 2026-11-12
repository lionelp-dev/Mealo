import type { GraphNode } from '@langchain/langgraph'
import type { RecipeContentDiscoveryContext } from '../../contexts/recipe_content_discovery_context.ts'
import { type RecipeContentDiscoveryState } from '../../state/recipe_content_discovery_state.ts'

export const generateRecipe: GraphNode<
  typeof RecipeContentDiscoveryState,
  RecipeContentDiscoveryContext
> = async (state, runtime) => {
  const catalog = runtime.context!.catalog
  const recipeCatalog = state.requiredMealTimeSlug
    ? {
        ...catalog,
        meal_times: catalog.meal_times.filter(
          (mealTime) => mealTime.slug === state.requiredMealTimeSlug
        ),
      }
    : catalog

  if (recipeCatalog.meal_times.length === 0) {
    throw new Error('Le moment de repas imposé est absent du catalogue.')
  }

  return {
    generatedRecipe: await runtime.context!.recipeGenerator.generateRecipe(
      state.prompt,
      state.generatedRecipeName,
      recipeCatalog
    ),
  }
}
