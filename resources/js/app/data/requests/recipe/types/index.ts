import { deleteRecipesRequestSchema } from '../schemas/delete-recipes.request.schema';
import { mealTimeRequestSchema } from '../schemas/entities/meal-time.request.schema';
import { recipeIngredientRequestSchema } from '../schemas/entities/recipe-ingredient.request.schema';
import { stepRequestSchema } from '../schemas/entities/step.request.schema';
import { tagRequestSchema } from '../schemas/entities/tag.request.schema';
import { generateRecipeRequestSchema } from '../schemas/generate-recipe.request.schema';
import { recipeFormRequestSchema } from '../schemas/recipe-form.request.schema';
import { storeRecipeRequestSchema } from '../schemas/store-recipe.request.schema';
import { updateRecipeRequestSchema } from '../schemas/update-recipe.request.schema';
import z from 'zod';

export type StoreRecipeRequest = z.infer<typeof storeRecipeRequestSchema>;
export type UpdateRecipeRequest = z.infer<typeof updateRecipeRequestSchema>;
export type DeleteRecipesRequest = z.infer<typeof deleteRecipesRequestSchema>;
export type GenerateRecipeRequest = z.infer<typeof generateRecipeRequestSchema>;
export type RecipeFormRequest = z.infer<typeof recipeFormRequestSchema>;

export type GeneratedRecipeResource = z.infer<typeof storeRecipeRequestSchema>;
export type RecipeIngredientRequest = z.infer<
  typeof recipeIngredientRequestSchema
>;
export type MealTimeRequest = z.infer<typeof mealTimeRequestSchema>;
export type StepRequest = z.infer<typeof stepRequestSchema>;
export type TagRequest = z.infer<typeof tagRequestSchema>;
