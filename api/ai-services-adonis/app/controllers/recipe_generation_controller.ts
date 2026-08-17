import { RecipeAiGenerationService } from '#services/recipe-generation/recipe_ai_generation_service'
import type { HttpContext } from '@adonisjs/core/http'
import z from 'zod'

const RecipesAIGenerationRequest = z.object({
  message: z.object({
    role: z.literal('user'),
    content: z.string().max(255),
  }),
  context: z.object({
    meal_time: z.string().trim().min(1).max(50).nullable().optional().default(null),
    count: z.number().int().min(1).max(10).nullable().optional().default(null),
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
