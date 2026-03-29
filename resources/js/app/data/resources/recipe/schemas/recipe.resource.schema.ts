import { mealTimeResourceSchema } from './meal-time.resource.schema';
import { recipeIngredientResourceSchema } from './recipe-ingredient.resource.schema';
import { stepResourceSchema } from './step.resource.schema';
import { tagResourceSchema } from './tag.resource.schema';
import { RecipeResourceData } from '@/types/generated';
import z from 'zod';

export const recipeResourceSchema = z.object({
  id: z.string(),
  user_id: z.number(),
  name: z.string(),
  description: z.string(),
  serving_size: z.number(),
  preparation_time: z.number(),
  cooking_time: z.number(),
  meal_times: z.array(mealTimeResourceSchema),
  ingredients: z.array(recipeIngredientResourceSchema),
  steps: z.array(stepResourceSchema),
  tags: z.array(tagResourceSchema),
  image_url: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
}) satisfies z.ZodType<RecipeResourceData>;
