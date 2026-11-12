import { StateSchema } from '@langchain/langgraph'
import z from 'zod'

const recipeNameGenerationRequestSchema = z.object({
  prompt: z.string(),
  requiredMealTimeSlug: z.string().nullable(),
})

const generatedRecipeNameResultSchema = recipeNameGenerationRequestSchema.extend({
  name: z.string().trim().min(1).max(255),
})

export const RecipeNameGenerationState = new StateSchema({
  pendingRecipeNameRequests: z.array(recipeNameGenerationRequestSchema).default([]),
  generatedRecipeNameResults: z.array(generatedRecipeNameResultSchema).default([]),
  acceptedRecipeNameResults: z.array(generatedRecipeNameResultSchema).default([]),
  excludedRecipeNames: z.array(z.string()).default([]),
})
