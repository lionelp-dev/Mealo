import type {
  DiscoveryCatalog,
  RecipeGenerator,
  RecipeImageGenerator,
} from '../contracts/recipe_discovery_contracts.ts'
import z from 'zod'

export type RecipeContentDiscoveryContext = {
  catalog: DiscoveryCatalog
  recipeGenerator: RecipeGenerator
  imageGenerator: RecipeImageGenerator
}

export const RecipeContentDiscoveryContextSchema = z.object({
  catalog: z.object({
    ingredient_categories: z.array(
      z.object({ id: z.number(), slug: z.string(), name: z.string() })
    ),
    meal_times: z.array(z.object({ id: z.number(), slug: z.string() })),
  }),
  recipeGenerator: z.custom<RecipeGenerator>(),
  imageGenerator: z.custom<RecipeImageGenerator>(),
})
