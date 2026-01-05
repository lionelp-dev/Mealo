import { useGenericContext } from '@/hooks/use-generic-context';

import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '@/types';

export interface MealPlanData {
  weekStart: string;
  mealTimes: MealTime[];
  plannedMeals: PlannedMeal[];
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
}

const { Provider: MealPlanDataProvider, useContextValue: useMealPlanContext } =
  useGenericContext<MealPlanData>();

export { MealPlanDataProvider, useMealPlanContext };
