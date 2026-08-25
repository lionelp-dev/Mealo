import z from 'zod'
import { recipeIngredientRequestSchema } from './entities/recipe_ingredient.request.schema.ts'
import { stepRequestSchema } from './entities/step.request.schema.ts'
import { tagRequestSchema } from './entities/tag.request.schema.ts'

export type IngredientCategoryCatalogItem = {
  id: number
  slug: string
  name: string
}

export type MealTimeCatalogItem = {
  id: number
  slug: string
}

export const createRecipeStoreRequestSchema = ({
  ingredient_categories,
  meal_times,
}: {
  ingredient_categories: IngredientCategoryCatalogItem[]
  meal_times: MealTimeCatalogItem[]
}) => {
  const allowedCategoryIds = ingredient_categories.map((category) => category.id)
  const allowedMealTimeSlugs = meal_times.map((mealTime) => mealTime.slug)

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Le titre ne peut pas être vide')
      .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
    description: z.string().trim().min(1, 'La description ne peut pas être vide'),
    serving_size: z
      .number()
      .int('Le nombre de portions doit être un entier')
      .min(1, 'Le nombre de portions doit être supérieur ou égal à 1')
      .max(50, 'Le nombre de portions ne doit pas dépasser 50'),
    preparation_time: z
      .number()
      .int('Le temps de préparation doit être un entier')
      .min(0, 'Le temps de préparation doit être supérieur ou égal à 0')
      .max(20160, 'Le temps de préparation ne doit pas dépasser 20160 minutes'),
    cooking_time: z
      .number()
      .int('Le temps de cuisson doit être un entier')
      .min(0, 'Le temps de cuisson doit être supérieur ou égal à 0')
      .max(20160, 'Le temps de cuisson ne doit pas dépasser 20160 minutes'),
    ingredients: z
      .array(
        recipeIngredientRequestSchema.extend({
          category_id: z
            .number()
            .int()
            .refine((value) => allowedCategoryIds.includes(value), {
              message: "Catégorie d'ingrédient invalide",
            }),
        })
      )
      .min(1, 'Au moins un ingrédient est requis')
      .max(255, 'La recette ne doit pas dépasser 255 ingrédients'),
    steps: z
      .array(stepRequestSchema)
      .min(1, 'Au moins une étape est requise')
      .max(255, 'La recette ne doit pas dépasser 255 étapes'),
    tags: z
      .array(tagRequestSchema)
      .min(1, 'Au moins un tag est requis')
      .max(255, 'La recette ne doit pas dépasser 255 tags'),
    // L'IA ne renvoie que le slug (clé sémantique fiable). L'id est re-résolu
    // depuis le catalogue côté serveur (cf. nodeGenerateRecipesByBatch).
    meal_times: z
      .array(
        z.object({
          slug: z.enum(allowedMealTimeSlugs as [string, ...string[]]),
        })
      )
      .min(1, 'Au moins un moment de repas est requis')
      .max(4, 'La recette ne doit pas dépasser 4 moments de repas'),
    image: z.null(),
    image_data_url: z.string().nullable().default(null),
  })
}
