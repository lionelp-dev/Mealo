import type { GraphNode } from '@langchain/langgraph'
import type { RecipeDiscoveryContext } from '../../contexts/recipe_discovery_context.ts'
import { type RecipeDiscoveryState } from '../../state/recipe_discovery_state.ts'

export const generateRecipeName: GraphNode<
  typeof RecipeDiscoveryState,
  RecipeDiscoveryContext
> = async (state, runtime) => ({
  generatedRecipeName: await runtime.context!.recipeGenerator.generateName(
    state.prompt,
    state.excludedRecipeNames
  ),
  generationAttempts: state.generationAttempts + 1,
  isDuplicateRecipe: false,
})
