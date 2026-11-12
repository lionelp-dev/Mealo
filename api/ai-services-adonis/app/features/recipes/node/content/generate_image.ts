import type { GraphNode } from '@langchain/langgraph'
import type { RecipeContentDiscoveryContext } from '../../contexts/recipe_content_discovery_context.ts'
import { type RecipeContentDiscoveryState } from '../../state/recipe_content_discovery_state.ts'

export const generateImage: GraphNode<
  typeof RecipeContentDiscoveryState,
  RecipeContentDiscoveryContext
> = async (state, runtime) => {
  if (!state.generatedRecipe) return { imageDataUrl: null, imageGenerationFailed: true }

  const imageDataUrl = await runtime.context!.imageGenerator.generateDataUrl(
    state.generatedRecipe.name
  )

  return { imageDataUrl, imageGenerationFailed: imageDataUrl === null }
}
