import type { GraphNode } from '@langchain/langgraph'
import type { RecipeNameGenerationContext } from '../../contexts/recipe_name_generation_context.ts'
import { type RecipeNameGenerationState } from '../../state/recipe_name_generation_state.ts'

export const generateRecipeNames: GraphNode<
  typeof RecipeNameGenerationState,
  RecipeNameGenerationContext
> = async (state, runtime) => {
  if (state.pendingRecipeNameRequests.length === 0) {
    throw new Error('Aucun nom de recette ne manque dans le batch.')
  }

  const names = await runtime.context!.recipeGenerator.generateNames(
    state.pendingRecipeNameRequests,
    state.excludedRecipeNames
  )

  if (names.length !== state.pendingRecipeNameRequests.length) {
    throw new Error('La génération de noms de recettes est incomplète.')
  }

  return {
    generatedRecipeNameResults: state.pendingRecipeNameRequests.map((request, index) => ({
      ...request,
      name: names[index]!,
    })),
  }
}
