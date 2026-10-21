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
  selected_meal_times: z.array(z.string().trim().min(1)).max(4).default([]),
  existing_recipe_names: z.array(z.string().trim().min(1).max(255)),
})

export default class RecipeDiscoveryController {
  async discover({ request, response }: HttpContext) {
    const parsed = discoveryRequestSchema.safeParse(request.all())
    if (!parsed.success) {
      return response.status(422).send({ errors: z.flattenError(parsed.error).fieldErrors })
    }

    const availableMealTimeSlugs = new Set(parsed.data.meal_times.map((mealTime) => mealTime.slug))
    const hasUnknownMealTime = parsed.data.selected_meal_times.some(
      (mealTime) => !availableMealTimeSlugs.has(mealTime)
    )

    if (hasUnknownMealTime) {
      return response.status(422).send({
        errors: { selected_meal_times: ['Un moment de repas sélectionné est invalide.'] },
      })
    }

    const selectedMealTimes = new Set(parsed.data.selected_meal_times)
    const mealTimes =
      selectedMealTimes.size > 0
        ? parsed.data.meal_times.filter((mealTime) => selectedMealTimes.has(mealTime.slug))
        : parsed.data.meal_times

    return new DiscoverRecipePoolUseCase().execute({
      ownerId: parsed.data.owner_id,
      prompt: parsed.data.prompt,
      selectedMealTimes: parsed.data.selected_meal_times,
      catalog: {
        ingredient_categories: parsed.data.ingredient_categories,
        meal_times: mealTimes,
        existing_recipe_names: parsed.data.existing_recipe_names,
      },
    })
  }
}
