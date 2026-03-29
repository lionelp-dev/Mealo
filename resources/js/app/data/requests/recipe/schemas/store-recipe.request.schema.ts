import { mealTimeRequestSchema } from './entities/meal-time.request.schema';
import { recipeIngredientRequestSchema } from './entities/recipe-ingredient.request.schema';
import { stepRequestSchema } from './entities/step.request.schema';
import { tagRequestSchema } from './entities/tag.request.schema';
import { StoreRecipeRequestData } from '@/types/generated';
import z from 'zod';

export const storeRecipeRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le titre ne peut pas être vide')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z.string().trim().min(1, 'La description ne peut pas être vide'),
  serving_size: z
    .number()
    .min(1, 'Le nombre de portions doit être supérieur ou égal à 1')
    .max(50, 'Le nombre de portions ne doit pas dépasser 50'),
  preparation_time: z
    .number()
    .min(0, 'Le temps de préparation doit être supérieur ou égal à 0'),
  cooking_time: z
    .number()
    .min(0, 'Le temps de cuisson doit être supérieur ou égal à 0'),
  ingredients: z
    .array(recipeIngredientRequestSchema)
    .min(1, 'Au moins un ingrédient est requis'),
  steps: z.array(stepRequestSchema).min(1, 'Au moins une étape est requise'),
  tags: z.array(tagRequestSchema).min(1, 'Au moins un tag est requis'),
  meal_times: z
    .array(mealTimeRequestSchema)
    .min(1, 'Au moins un moment de repas est requis'),
  image: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "L'image ne doit pas dépasser 5MB",
      })
      .refine(
        (file) =>
          ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
            file.type,
          ),
        {
          message: "L'image doit être au format JPEG, PNG ou WebP",
        },
      ),
    z.null(),
  ]),
}) satisfies z.ZodType<StoreRecipeRequestData>;
