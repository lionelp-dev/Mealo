import type { GraphNode } from '@langchain/langgraph'
import type { RecipeDiscoveryContext } from '../contexts/recipe_discovery_context.ts'
import { type RecipeDiscoveryState } from '../state/recipe_discovery_state.ts'

export const generateImage: GraphNode<typeof RecipeDiscoveryState, RecipeDiscoveryContext> = async (
  state,
  runtime
) => {
  if (!state.generatedRecipe) return { imageDataUrl: null, imageGenerationFailed: true }
  const imageDataUrl = await runtime.context!.imageGenerator.generateDataUrl(
    state.generatedRecipe.name
  )
  return { imageDataUrl, imageGenerationFailed: imageDataUrl === null }
}
