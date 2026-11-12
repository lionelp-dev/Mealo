import { StateSchema } from '@langchain/langgraph'
import z from 'zod'

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  category_id: z.number().int(),
})

const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  serving_size: z.number().int(),
  preparation_time: z.number().int(),
  cooking_time: z.number().int(),
  meal_times: z.array(z.object({ id: z.number().int(), slug: z.string() })),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.object({ order: z.number().int(), description: z.string() })),
  tags: z.array(z.object({ name: z.string() })),
  image_data_url: z.string().nullable(),
})

export const RecipeContentDiscoveryState = new StateSchema({
  prompt: z.string(),
  requiredMealTimeSlug: z.string().nullable().default(null),
  generatedRecipeName: z.string().trim().min(1).max(255),
  generatedRecipe: recipeSchema.nullable().default(null),
  imageDataUrl: z.string().nullable().default(null),
  imageGenerationFailed: z.boolean().default(false),
})
