export type DeleteRecipesRequestData = {
  ids: Array<string>;
};
export type FilterRecipesRequestData = {
  search?: string;
  tags?: Array<number> | null;
  meal_times?: Array<number> | null;
  preparation_time?: string;
  cooking_time?: string;
};
export type GenerateRecipeRequestData = {
  prompt: string;
};
export type IngredientRequestData = {
  name: string;
  quantity: number;
  unit: string;
  id?: string;
};
export type IngredientResourceData = {
  id: string;
  name: string;
};
export type MealTimeEnum = {
  name: string;
  value: string;
};
export type MealTimeRequestData = {
  name: string;
};
export type MealTimeResourceData = {
  id: number;
  name: string;
};
export type RecipeAIPromptResourceData = {
  id: string;
  name: string;
  serving_size: number;
  meal_times: Array<MealTimeResourceData>;
  tags: Array<TagResourceData>;
};
export type RecipeFormRequestData = {
  ingredients_search?: string;
  tags_search?: string;
  show_generate_recipe_with_ai_modal?: boolean;
};
export type RecipeIngredientResourceData = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};
export type RecipeResourceData = {
  id: string;
  user_id: number;
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeResourceData>;
  ingredients: Array<RecipeIngredientResourceData> | undefined;
  steps: Array<StepResourceData>;
  tags: Array<TagResourceData>;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};
export type StepRequestData = {
  order: number;
  description: string;
};
export type StepResourceData = {
  id: string;
  order: number;
  description: string;
};
export type StoreRecipeRequestData = {
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeRequestData>;
  ingredients: Array<IngredientRequestData>;
  steps: Array<StepRequestData>;
  tags: Array<TagRequestData>;
  image: File | null;
};
export type TagRequestData = {
  name: string;
};
export type TagResourceData = {
  id: string;
  name: string;
};
export type Unit = {
  name: string;
  value: string;
};
export type UpdateRecipeRequestData = {
  id: string;
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeRequestData>;
  ingredients: Array<IngredientRequestData>;
  steps: Array<StepRequestData>;
  tags: Array<TagRequestData>;
  image: File | null;
};
