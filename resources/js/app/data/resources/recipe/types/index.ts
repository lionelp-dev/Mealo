import { ingredientResourceSchema } from '../schemas/ingredient.resource.schema';
import { mealTimeResourceSchema } from '../schemas/meal-time.resource.schema';
import { recipeIngredientResourceSchema } from '../schemas/recipe-ingredient.resource.schema';
import { recipeResourceSchema } from '../schemas/recipe.resource.schema';
import { stepResourceSchema } from '../schemas/step.resource.schema';
import { tagResourceSchema } from '../schemas/tag.resource.schema';
import z from 'zod';

export type RecipeResource = z.infer<typeof recipeResourceSchema>;
export type RecipeIngredientResource = z.infer<
  typeof recipeIngredientResourceSchema
>;
export type MealTimeResource = z.infer<typeof mealTimeResourceSchema>;
export type StepResource = z.infer<typeof stepResourceSchema>;
export type TagResource = z.infer<typeof tagResourceSchema>;
export type IngredientResource = z.infer<typeof ingredientResourceSchema>;
