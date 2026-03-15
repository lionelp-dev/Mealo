export type IngredientData = {
  id: number | null;
  name: string;
  quantity: number;
  unit: string;
};
export type MealTimeData = {
  id: number | null;
  name: string;
};
export type MealTimeEnum = 'breakfast' | 'lunch' | 'diner' | 'snack';
export type RecipeRequest = {
  name: string;
  description: string | null;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeData>;
  ingredients: Array<IngredientData>;
  steps: Array<StepData>;
  tags: Array<TagData>;
  image: string | null;
};
export type RecipeResource = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeData>;
  ingredients: Array<IngredientData>;
  steps: Array<StepData>;
  tags: Array<TagData>;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};
export type StepData = {
  id: number | null;
  order: number;
  description: string;
};
export type TagData = {
  id: number | null;
  name: string;
};
export type Unit =
  | 'ml'
  | 'cl'
  | 'dl'
  | 'l'
  | 'tsp'
  | 'tbsp'
  | 'fl oz'
  | 'cup'
  | 'pint'
  | 'quart'
  | 'gallon'
  | 'mg'
  | 'g'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'piece'
  | 'pinch'
  | 'dash'
  | 'handful'
  | 'slice'
  | 'clove'
  | 'bunch'
  | 'package'
  | 'can'
  | 'jar'
  | 'bottle'
  | 'box'
  | 'bag'
  | 'to taste'
  | 'as needed';
