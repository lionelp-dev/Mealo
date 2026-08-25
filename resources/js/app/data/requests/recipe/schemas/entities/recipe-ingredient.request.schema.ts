import { IngredientRequestData } from '@/types/generated';
import z from 'zod';

export const recipeIngredientRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de l'ingrédient ne peut pas être vide"),
  quantity: z.number().min(0, 'La quantité doit être supérieure ou égale à 0'),
  unit: z.string().trim().min(1, "L'unité ne peut pas être vide"),
  category_id: z.number().int().min(1, 'La catégorie est requise'),
}) satisfies z.ZodType<IngredientRequestData>;
