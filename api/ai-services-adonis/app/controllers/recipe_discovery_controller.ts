import { DiscoverRecipePoolUseCase } from '../features/recipes/use_cases/discover_recipe_pool_use_case.ts'
import type { HttpContext } from '@adonisjs/core/http'
import z from 'zod'

const discoveryRequestSchema = z.object({
  owner_id: z.number().int().positive(),
  prompt: z.string().trim().min(3).max(5000),
  ingredient_categories: z
    .array(z.object({ id: z.number().int().positive(), slug: z.string(), name: z.string() }))
    .min(1),
  meal_times: z.array(z.object({ id: z.number().int().positive(), slug: z.string() })).min(1),
  existing_recipe_names: z.array(z.string().trim().min(1).max(255)),
})

export default class RecipeDiscoveryController {
  async discover({ request, response }: HttpContext) {
    const parsed = discoveryRequestSchema.safeParse(request.all())
    if (!parsed.success) {
      return response.status(422).send({ errors: z.flattenError(parsed.error).fieldErrors })
    }

    return new DiscoverRecipePoolUseCase().execute({
      ownerId: parsed.data.owner_id,
      prompt: parsed.data.prompt,
      catalog: {
        ingredient_categories: parsed.data.ingredient_categories,
        meal_times: parsed.data.meal_times,
        existing_recipe_names: parsed.data.existing_recipe_names,
      },
    })
  }
}
