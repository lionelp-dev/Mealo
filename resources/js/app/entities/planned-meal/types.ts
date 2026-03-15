import type { MealTime } from '@/app/entities/meal-time/types';
import type { Recipe } from '@/app/entities/recipe/types';
import type { DateTime } from 'luxon';

export type PlannedMeal = {
  id: number;
  workspace_id?: number;
  meal_time_id: number;
  planned_date: string;
  recipe: Pick<Recipe, 'id' | 'name' | 'image_url'>;
  serving_size: number;
};

export type PlannedMealsSlot = {
  mealTime: MealTime;
  plannedMeals: PlannedMeal[];
};

export type DayPlannedMeals = {
  date: DateTime;
  plannedMealsSlots: PlannedMealsSlot[];
};
