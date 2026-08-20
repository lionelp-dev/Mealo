import type { GraphNode } from '@langchain/langgraph'

import { RecipeImageClient } from '../clients/recipe_image_client.ts'
import type { GraphState } from '../recipe_generation_state.ts'
import { chunk } from '../utils/chunk.ts'

const MAX_CONCURRENT_IMAGE_GENERATIONS = 5

export const nodeGenerateRecipeImagesByBatch: GraphNode<typeof GraphState> = async (state) => {
  const { recipes } = state

  const imageClient = new RecipeImageClient()

  const batches = chunk(recipes, MAX_CONCURRENT_IMAGE_GENERATIONS)

  const imageDataUrls: (string | null)[] = []

  for (const batch of batches) {
    const urls = await Promise.all(batch.map((recipe) => imageClient.generateDataUrl(recipe.name)))

    imageDataUrls.push(...urls)
  }

  return {
    recipes: recipes.map((recipe, index) => ({
      ...recipe,
      image_data_url: imageDataUrls[index],
    })),
  }
}
