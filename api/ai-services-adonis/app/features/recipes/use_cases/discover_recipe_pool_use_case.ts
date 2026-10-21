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

const mealTimeLabels: Record<string, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  diner: 'Dîner',
  snack: 'Collation',
}

function promptWithMealTimeConstraint(prompt: string, selectedMealTimes: string[]) {
  if (selectedMealTimes.length === 0) return prompt

  const labels = selectedMealTimes.map((mealTime) => mealTimeLabels[mealTime] ?? mealTime)

  return `${prompt}\n\nContrainte obligatoire — moments de repas : ${labels.join(', ')}. La recette doit réellement convenir à au moins un de ces moments : adapte le type de plat, les ingrédients et les portions. Ne les utilise jamais comme de simples étiquettes.`
}

function promptWithRequiredMealTime(prompt: string, mealTime: string) {
  const label = mealTimeLabels[mealTime] ?? mealTime

  return `${prompt}\n\nContrainte obligatoire — moment de repas : ${label}. La recette doit réellement et uniquement convenir à ce moment : adapte le type de plat, les ingrédients et les portions. Ne l'utilise jamais comme une simple étiquette.`
}

type DiscoveryCandidate = {
  prompt: string
  requiredMealTimeSlug: string | null
}

export function buildDiscoveryCandidates(
  prompt: string,
  selectedMealTimes: string[],
  mealTimes: DiscoveryCatalog['meal_times'],
  random: () => number = Math.random
): DiscoveryCandidate[] {
  if (selectedMealTimes.length > 0) {
    const discoveryPrompt = promptWithMealTimeConstraint(prompt, selectedMealTimes)

    return Array.from({ length: DISCOVERY_POOL_SIZE }, () => ({
      prompt: discoveryPrompt,
      requiredMealTimeSlug: null,
    }))
  }

  return Array.from({ length: DISCOVERY_POOL_SIZE }, () => {
    const mealTime = mealTimes[Math.floor(random() * mealTimes.length)]

    if (!mealTime) throw new Error('Le catalogue des moments de repas est vide.')

    return {
      prompt: promptWithRequiredMealTime(prompt, mealTime.slug),
      requiredMealTimeSlug: mealTime.slug,
    }
  })
}

export class DiscoverRecipePoolUseCase {
  private readonly generator = new OpenRouterRecipeGenerator()
  private readonly imageGenerator = new OpenRouterRecipeImageGenerator()

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
    const candidates = buildDiscoveryCandidates(prompt, selectedMealTimes, catalog.meal_times)

    const results = await recipeDiscoveryGraph.batch(
      candidates,
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
