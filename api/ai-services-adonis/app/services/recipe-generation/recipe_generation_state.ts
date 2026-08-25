import { StateSchema } from '@langchain/langgraph'
import z from 'zod'

const ingredientCategoryCatalogSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string(),
  name: z.string(),
})

const mealTimeCatalogSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
})

export const GraphState = new StateSchema({
  message: z.object({
    role: z.literal('user'),
    content: z.string(),
  }),
  ingredient_categories: z.array(ingredientCategoryCatalogSchema),
  meal_times: z.array(mealTimeCatalogSchema),
  context: z.object({
    meal_time: z.string().nullable(),
    count: z.number().int().positive().nullable(),
    generate_images: z.boolean().default(false),
  }),
  recipeNames: z.array(z.string()).default(() => []),
  recipes: z.array(z.any()),
})
