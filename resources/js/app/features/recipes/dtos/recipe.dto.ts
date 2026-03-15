import { createDto } from '@/app/utils/create-dto';
import { z } from 'zod';

// ============================================
// TYPES GÉNÉRÉS PAR LE BACKEND
// ============================================
export type RecipeStoreRequest = {
  name: string;
  description: string;
  meal_times: string;
};

export type RecipeUpdateRequest = {
  name?: string;
  description?: string;
  meal_times?: string;
};

export type RecipeRessource = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  meal_times: string;
};

// ============================================
// ENTITY (SOURCE DE VÉRITÉ FRONTEND)
// ============================================
export type RecipeEntity = {
  id: number;
  name: string;
  description: string;
  mealTimes: string;
};

// ============================================
// SCHEMAS
// ============================================
const recipeResourceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string(),
  meal_times: z.string(),
}) satisfies z.ZodType<RecipeRessource>;

const recipeEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  mealTimes: z.string(),
});

// ============================================
// DTOs (un par flux)
// ============================================

// Flux 1 : Resource → Entity (lecture)
export const RecipeFromResource = createDto({
  schema: recipeResourceSchema,
  transform: (r) =>
    ({
      id: r.id,
      name: r.name,
      description: r.description,
      mealTimes: r.meal_times,
    }) satisfies RecipeEntity,
});

// Flux 2 : Entity (sans id) → StoreRequest (création)
export const RecipeToStoreRequest = createDto({
  schema: recipeEntitySchema.omit({ id: true }),
  transform: (e) =>
    ({
      name: e.name,
      description: e.description,
      meal_times: e.mealTimes,
    }) satisfies RecipeStoreRequest,
});

// Flux 3 : Entity (partial) → UpdateRequest (modification)
export const RecipeToUpdateRequest = createDto({
  schema: recipeEntitySchema.partial(),
  transform: (e) =>
    ({
      name: e.name,
      description: e.description,
      meal_times: e.mealTimes,
    }) satisfies RecipeUpdateRequest,
});
