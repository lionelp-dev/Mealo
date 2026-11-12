import type { RecipeGenerator, RecipeRepository } from '../contracts/recipe_discovery_contracts.ts'
import z from 'zod'

export type RecipeNameGenerationContext = {
  ownerId: number
  recipeGenerator: RecipeGenerator
  recipeRepository: RecipeRepository
}

export const RecipeNameGenerationContextSchema = z.object({
  ownerId: z.number().int().positive(),
  recipeGenerator: z.custom<RecipeGenerator>(),
  recipeRepository: z.custom<RecipeRepository>(),
})
