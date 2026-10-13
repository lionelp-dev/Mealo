import type {
  DiscoveryCatalog,
  RecipeGenerator,
  RecipeImageGenerator,
  RecipeRepository,
} from '../contracts/recipe_discovery_contracts.ts'
import z from 'zod'

export type RecipeDiscoveryContext = {
  ownerId: number
  catalog: DiscoveryCatalog
  recipeGenerator: RecipeGenerator
  imageGenerator: RecipeImageGenerator
  recipeRepository: RecipeRepository
}

export const RecipeDiscoveryContextSchema = z.object({
  ownerId: z.number().int().positive(),
  catalog: z.object({
    ingredient_categories: z.array(
      z.object({ id: z.number(), slug: z.string(), name: z.string() })
    ),
    meal_times: z.array(z.object({ id: z.number(), slug: z.string() })),
    existing_recipe_names: z.array(z.string()),
  }),
  recipeGenerator: z.custom<RecipeGenerator>(),
  imageGenerator: z.custom<RecipeImageGenerator>(),
  recipeRepository: z.custom<RecipeRepository>(),
})
