import { RecipeAiGenerationService } from '#services/recipe-generation/recipe_ai_generation_service'
import type { HttpContext } from '@adonisjs/core/http'
import z from 'zod'

const RecipesAIGenerationRequest = z.object({
  message: z.object({
    role: z.literal('user'),
    content: z.string().max(255),
  }),
  ingredient_categories: z
    .array(
      z.object({
        id: z.number().int().positive(),
        slug: z.string().min(1).max(255),
        name: z.string().min(1).max(255),
      })
    )
    .min(1),
  meal_times: z
    .array(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(255),
      })
    )
    .min(1),
  context: z.object({
    meal_time: z.string().trim().min(1).max(50).nullable().optional().default(null),
    count: z.number().int().min(1).max(10).nullable().optional().default(null),
    generate_images: z.boolean().optional().default(false),
  }),
})

export default class RecipeGenerationController {
  async generate({ request, response }: HttpContext) {
    const parsed = RecipesAIGenerationRequest.safeParse(request.all())

    if (!parsed.success) {
      return response.status(422).send({
        errors: z.flattenError(parsed.error).fieldErrors,
      })
    }

    const recipeAiGenerationService = new RecipeAiGenerationService()

    return {
      recipes: await recipeAiGenerationService.generateMany(parsed.data),
    }
  }
}
