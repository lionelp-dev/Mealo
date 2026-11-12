import { DISCOVERY_MAX_CONCURRENCY, DISCOVERY_POOL_SIZE } from '../constants.ts'
import type {
  DiscoveryCatalog,
  GeneratedDiscoveryRecipe,
  RecipeNameGenerationRequest,
} from '../contracts/recipe_discovery_contracts.ts'
import { recipeContentDiscoveryGraph } from '../graphs/recipe_content_discovery_graph.ts'
import { recipeNameGenerationGraph } from '../graphs/recipe_name_generation_graph.ts'
import { DirectRecipeNameRepository } from '../repositories/index.ts'
import { OpenRouterRecipeImageGenerator } from '../services/openrouter_recipe_image_generator.ts'
import { OpenRouterRecipeGenerator } from '../services/openrouter_recipe_generator.ts'
import logger from '@adonisjs/core/services/logger'

export type DiscoveredRecipe = GeneratedDiscoveryRecipe & {
  image_data_url: string | null
  image_generation_failed: boolean
}

const mealTimeLabels: Record<string, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  diner: 'Dîner',
  snack: 'Collation',
}

export class DiscoverRecipePoolUseCase {
  private readonly generator = new OpenRouterRecipeGenerator()
  private readonly imageGenerator = new OpenRouterRecipeImageGenerator()

  private buildRecipeNameGenerationRequests(
    prompt: string,
    selectedMealTimes: string[],
    mealTimes: DiscoveryCatalog['meal_times'],
    random: () => number = Math.random
  ): RecipeNameGenerationRequest[] {
    return Array.from({ length: DISCOVERY_POOL_SIZE }, (_, position) => {
      const mealTime =
        selectedMealTimes.length > 0
          ? selectedMealTimes[position % selectedMealTimes.length]!
          : mealTimes[Math.floor(random() * mealTimes.length)]?.slug

      if (!mealTime) throw new Error('Le catalogue des moments de repas est vide.')

      const mealTimeLabel = mealTimeLabels[mealTime] ?? mealTime
      const promptWithMealTimeConstraint = `${prompt}\n\nContrainte obligatoire — moment de repas : ${mealTimeLabel}. La recette doit réellement et uniquement convenir à ce moment : adapte le type de plat, les ingrédients et les portions. Ne l'utilise jamais comme une simple étiquette.`

      return {
        prompt: promptWithMealTimeConstraint,
        requiredMealTimeSlug: mealTime,
      }
    })
  }

  async execute({
    ownerId,
    prompt,
    selectedMealTimes,
    catalog,
  }: {
    ownerId: number
    prompt: string
    selectedMealTimes: string[]
    catalog: DiscoveryCatalog
  }) {
    const recipeNameGenerationRequests = this.buildRecipeNameGenerationRequests(
      prompt,
      selectedMealTimes,
      catalog.meal_times
    )
    const recipeNameGeneration = await recipeNameGenerationGraph.invoke(
      { pendingRecipeNameRequests: recipeNameGenerationRequests },
      {
        context: {
          ownerId,
          recipeGenerator: this.generator,
          recipeRepository: new DirectRecipeNameRepository(),
        },
      }
    )

    if (recipeNameGeneration.acceptedRecipeNameResults.length !== DISCOVERY_POOL_SIZE) {
      throw new Error('Le batch de noms de recettes est incomplet.')
    }

    const recipeContentGenerationResults = await recipeContentDiscoveryGraph.batch(
      recipeNameGeneration.acceptedRecipeNameResults.map((recipeNameResult) => ({
        prompt: recipeNameResult.prompt,
        requiredMealTimeSlug: recipeNameResult.requiredMealTimeSlug,
        generatedRecipeName: recipeNameResult.name,
      })),
      {
        maxConcurrency: DISCOVERY_MAX_CONCURRENCY,
        context: {
          catalog,
          recipeGenerator: this.generator,
          imageGenerator: this.imageGenerator,
        },
      },
      { returnExceptions: true }
    )

    const discoveredRecipes: DiscoveredRecipe[] = []
    for (const [index, result] of recipeContentGenerationResults.entries()) {
      if (result instanceof Error) {
        logger.error(
          { err: result, ownerId, request: index + 1 },
          'Recipe content generation request failed'
        )
        continue
      }

      if (!result.generatedRecipe) {
        logger.error(
          { ownerId, request: index + 1 },
          'Recipe content generation request completed without a recipe'
        )
        continue
      }

      if (result.imageGenerationFailed) {
        logger.warn(
          { ownerId, request: index + 1, recipeName: result.generatedRecipe.name },
          'Recipe content generation request excluded because image generation failed'
        )
        continue
      }

      discoveredRecipes.push({
        ...result.generatedRecipe,
        image_data_url: result.imageDataUrl,
        image_generation_failed: result.imageGenerationFailed,
      })
    }

    return {
      recipes: discoveredRecipes,
      failedRecipeCount: DISCOVERY_POOL_SIZE - discoveredRecipes.length,
    }
  }
}
