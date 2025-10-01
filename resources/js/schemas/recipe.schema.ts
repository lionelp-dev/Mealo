import z from 'zod';

const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de l'ingrédient ne peut pas être vide"),
  quantity: z.number().min(0, 'La quantité doit être supérieure ou égale à 0'),
  unit: z.string().trim().min(1, "L'unité ne peut pas être vide"),
});

const stepSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "La description de l'étape ne peut pas être vide"),
  order: z.number().min(0, "L'ordre doit être supérieur ou égal à 0"),
});

const tagSchema = z.object({
  name: z.string().trim().min(1, 'Le nom du tag ne doit pas être vide'),
});

const mealTimeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom du moment de repas ne peut pas être vide'),
});

const recipeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le titre ne peut pas être vide')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),
  description: z.string().trim().min(1, 'La description ne peut pas être vide'),
  preparation_time: z
    .number()
    .min(0, 'Le temps de préparation doit être supérieur ou égal à 0'),
  cooking_time: z
    .number()
    .min(0, 'Le temps de cuisson doit être supérieur ou égal à 0'),
  ingredients: z
    .array(z.object({ ...ingredientSchema.shape }))
    .min(1, 'Au moins un ingrédient est requis'),
  steps: z
    .array(z.object({ ...stepSchema.shape }))
    .min(1, 'Au moins une étape est requise'),
  tags: z
    .array(z.object({ ...tagSchema.shape }))
    .min(1, 'Au moins un tag est requis'),
  meal_times: z
    .array(z.object({ ...mealTimeSchema.shape }))
    .min(1, 'Au moins un moment de repas est requis'),
});

export {
  ingredientSchema,
  mealTimeSchema,
  recipeSchema,
  stepSchema,
  tagSchema,
};
