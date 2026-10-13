import type { GraphNode } from '@langchain/langgraph'
import type { RecipeDiscoveryContext } from '../../contexts/recipe_discovery_context.ts'
import { type RecipeDiscoveryState } from '../../state/recipe_discovery_state.ts'

export const generateRecipe: GraphNode<
  typeof RecipeDiscoveryState,
  RecipeDiscoveryContext
> = async (state, runtime) => {
  if (!state.generatedRecipeName)
    throw new Error('Le nom de recette généré est absent du workflow.')
  return {
    generatedRecipe: await runtime.context!.recipeGenerator.generateRecipe(
      state.prompt,
      state.generatedRecipeName,
      runtime.context!.catalog
    ),
  }
}
