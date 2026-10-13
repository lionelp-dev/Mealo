import type { GraphNode } from '@langchain/langgraph'
import type { RecipeDiscoveryContext } from '../../contexts/recipe_discovery_context.ts'
import { type RecipeDiscoveryState } from '../../state/recipe_discovery_state.ts'

export const checkRecipeDuplicate: GraphNode<
  typeof RecipeDiscoveryState,
  RecipeDiscoveryContext
> = async (state, runtime) => {
  if (!state.generatedRecipeName)
    throw new Error('Le nom de recette généré est absent du workflow.')
  const isDuplicateRecipe = await runtime.context!.recipeRepository.recipeNameExists(
    runtime.context!.ownerId,
    state.generatedRecipeName
  )
  return {
    isDuplicateRecipe,
    excludedRecipeNames: isDuplicateRecipe
      ? [...state.excludedRecipeNames, state.generatedRecipeName]
      : state.excludedRecipeNames,
  }
}
