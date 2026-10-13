import { DISCOVERY_MAX_CONCURRENCY, DISCOVERY_POOL_SIZE } from '../constants.ts'
import type {
  DiscoveryCatalog,
  GeneratedDiscoveryRecipe,
} from '../contracts/recipe_discovery_contracts.ts'
import { recipeDiscoveryGraph } from '../graphs/recipe_discovery_graph.ts'
import { ExistingRecipeNamesRepository } from '../repositories/index.ts'
import { OpenRouterRecipeImageGenerator } from '../services/openrouter_recipe_image_generator.ts'
import { OpenRouterRecipeGenerator } from '../services/openrouter_recipe_generator.ts'
import logger from '@adonisjs/core/services/logger'

export type DiscoveredRecipe = GeneratedDiscoveryRecipe & {
  image_data_url: string | null
  image_generation_failed: boolean
}

export class DiscoverRecipePoolUseCase {
  private readonly generator = new OpenRouterRecipeGenerator()
  private readonly imageGenerator = new OpenRouterRecipeImageGenerator()

  async execute({
    ownerId,
    prompt,
    catalog,
  }: {
    ownerId: number
    prompt: string
    catalog: DiscoveryCatalog
  }) {
    const results = await recipeDiscoveryGraph.batch(
      Array.from({ length: DISCOVERY_POOL_SIZE }, () => ({ prompt })),
      {
        maxConcurrency: DISCOVERY_MAX_CONCURRENCY,
        context: {
          ownerId,
          catalog,
          recipeGenerator: this.generator,
          imageGenerator: this.imageGenerator,
          recipeRepository: new ExistingRecipeNamesRepository(catalog.existing_recipe_names),
        },
      },
      { returnExceptions: true }
    )

    const recipes: DiscoveredRecipe[] = []
    for (const [index, result] of results.entries()) {
      if (result instanceof Error) {
        logger.error(
          { err: result, ownerId, candidate: index + 1 },
          'Recipe discovery candidate generation failed'
        )
        continue
      }

      if (!result.generatedRecipe) {
        logger.error(
          { ownerId, candidate: index + 1 },
          'Recipe discovery candidate completed without a recipe'
        )
        continue
      }

      recipes.push({
        ...result.generatedRecipe,
        image_data_url: result.imageDataUrl,
        image_generation_failed: result.imageGenerationFailed,
      })
    }

    return { recipes, failedRecipeCount: DISCOVERY_POOL_SIZE - recipes.length }
  }
}
