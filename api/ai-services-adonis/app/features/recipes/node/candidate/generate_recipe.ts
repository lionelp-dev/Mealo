import type { GraphNode } from '@langchain/langgraph'
import type { RecipeDiscoveryContext } from '../../contexts/recipe_discovery_context.ts'
import { type RecipeDiscoveryState } from '../../state/recipe_discovery_state.ts'

export const generateRecipe: GraphNode<
  typeof RecipeDiscoveryState,
  RecipeDiscoveryContext
> = async (state, runtime) => {
  if (!state.generatedRecipeName)
    throw new Error('Le nom de recette généré est absent du workflow.')

  const catalog = runtime.context!.catalog
  const recipeCatalog = state.requiredMealTimeSlug
    ? {
        ...catalog,
        meal_times: catalog.meal_times.filter(
          (mealTime) => mealTime.slug === state.requiredMealTimeSlug
        ),
      }
    : catalog

  if (recipeCatalog.meal_times.length === 0)
    throw new Error('Le moment de repas imposé est absent du catalogue.')

  return {
    generatedRecipe: await runtime.context!.recipeGenerator.generateRecipe(
      state.prompt,
      state.generatedRecipeName,
      recipeCatalog
    ),
  }
}
