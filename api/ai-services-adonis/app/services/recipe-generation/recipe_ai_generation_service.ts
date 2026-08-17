import { recipeGenerationGraph } from './recipe_generation_graph.ts'

export class RecipeAiGenerationService {
  async generateMany({
    message,
    context,
  }: {
    message: { role: 'user'; content: string }
    context: { meal_time: string | null; count: number | null }
  }) {
    if (context.count !== null && (!Number.isInteger(context.count) || context.count < 1)) {
      throw new Error('Recipe generation count must be a positive integer')
    }

    const result = await recipeGenerationGraph.invoke({
      message,
      context,
    })

    return result.recipes
  }
}
