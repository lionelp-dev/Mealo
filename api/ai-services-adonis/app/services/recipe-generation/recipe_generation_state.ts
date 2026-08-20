import { StateSchema } from '@langchain/langgraph'
import z from 'zod'

import { recipeStoreRequestSchema } from '../../data/request/recipe/schemas/recipe_store.request.schema.ts'

export const GraphState = new StateSchema({
  message: z.object({
    role: z.literal('user'),
    content: z.string(),
  }),
  context: z.object({
    meal_time: z.string().nullable(),
    count: z.number().int().positive().nullable(),
    generate_images: z.boolean().default(false),
  }),
  recipeNames: z.array(z.string()).default(() => []),
  recipes: z.array(recipeStoreRequestSchema),
})
