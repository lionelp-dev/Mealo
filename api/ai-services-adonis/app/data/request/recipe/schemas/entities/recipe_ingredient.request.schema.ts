import z from 'zod'
import { unitSchema } from './unit.schema.ts'

export const recipeIngredientRequestSchema = z.object({
  name: z.string().trim().min(1, "Le nom de l'ingrédient ne peut pas être vide"),
  quantity: z.number().min(0, 'La quantité doit être supérieure ou égale à 0'),
  unit: unitSchema,
  category_id: z.number().int().positive(),
})

export type GeneratedRecipeIngredientRequest = z.infer<typeof recipeIngredientRequestSchema>
