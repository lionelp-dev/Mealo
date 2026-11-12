import { RecipeImageClient } from '#services/recipe-generation/clients/recipe_image_client'
import { DISCOVERY_IMAGE_TIMEOUT_MS } from '../constants.ts'
import type { RecipeImageGenerator } from '../contracts/recipe_discovery_contracts.ts'

export class OpenRouterRecipeImageGenerator implements RecipeImageGenerator {
  private readonly client = new RecipeImageClient()

  generateDataUrl(name: string) {
    return this.client.generateDataUrl(name, { timeoutMs: DISCOVERY_IMAGE_TIMEOUT_MS })
  }
}
