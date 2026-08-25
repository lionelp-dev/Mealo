import { recipeGenerationGraph } from './recipe_generation_graph.ts'

export class RecipeAiGenerationService {
  async generateMany({
    message,
    ingredient_categories,
    meal_times,
    context,
  }: {
    message: { role: 'user'; content: string }
    ingredient_categories: Array<{ id: number; slug: string; name: string }>
    meal_times: Array<{ id: number; name: string }>
    context: { meal_time: string | null; count: number | null }
  }) {
    if (context.count !== null && (!Number.isInteger(context.count) || context.count < 1)) {
      throw new Error('Recipe generation count must be a positive integer')
    }

    const result = await recipeGenerationGraph.invoke({
      message,
      ingredient_categories,
      meal_times,
      context,
    })

    return result.recipes
  }
}
