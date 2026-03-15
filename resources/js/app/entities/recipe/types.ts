import type { MealTime } from '@/app/entities/meal-time/types';

export type Ingredient = {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
};

export type Step = {
  id?: number;
  order: number;
  description: string;
};

export type Tag = {
  id?: number;
  name: string;
};

export type Recipe = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: MealTime[];
  ingredients: Ingredient[];
  steps: Step[];
  tags: Tag[];
  image_url?: string | null;
  image: File | null;
};

export type Option = { value: string; label: string };

export type Filter = {
  type: 'meal_time' | 'preparation_time' | 'cooking_time' | 'tag';
} & Option;

export type FilterSection = {
  title: string;
  type: Filter['type'];
  options: Option[];
};
