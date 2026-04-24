import { mealTimeRequestSchema } from '../schemas/entities/meal-time.request.schema';
import { recipeIngredientRequestSchema } from '../schemas/entities/recipe-ingredient.request.schema';
import { stepRequestSchema } from '../schemas/entities/step.request.schema';
import { tagRequestSchema } from '../schemas/entities/tag.request.schema';
import { recipeAIGenerationRequestSchema } from '../schemas/recipe-ai-generation.request.schema';
import { recipeSearchRequestSchema } from '../schemas/recipe-search.request.schema';
import { recipeStoreRequestSchema } from '../schemas/recipe-store.request.schema';
import { recipeUpdateRequestSchema } from '../schemas/recipe-update.request.schema';
import { recipesDestroyRequestSchema } from '../schemas/recipes-destroy.request.schema';
import z from 'zod';

export type RecipeStoreRequest = z.infer<typeof recipeStoreRequestSchema>;
export type RecipeUpdateRequest = z.infer<typeof recipeUpdateRequestSchema>;
export type RecipesDeleteRequest = z.infer<typeof recipesDestroyRequestSchema>;
export type RecipeAIGenerationRequest = z.infer<
  typeof recipeAIGenerationRequestSchema
>;
export type RecipeSearchRequest = z.infer<typeof recipeSearchRequestSchema>;

export type RecipeIngredientRequest = z.infer<
  typeof recipeIngredientRequestSchema
>;
export type MealTimeRequest = z.infer<typeof mealTimeRequestSchema>;
export type StepRequest = z.infer<typeof stepRequestSchema>;
export type TagRequest = z.infer<typeof tagRequestSchema>;

export type GeneratedRecipeResource = z.infer<typeof recipeStoreRequestSchema>;
