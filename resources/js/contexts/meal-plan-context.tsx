/* eslint-disable react-hooks/rules-of-hooks */
import { useGenericContext } from '@/hooks/use-generic-context';

import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
  WorkspaceData,
} from '@/types';

export interface MealPlanContextProps {
  weekStart: string;
  mealTimes: MealTime[];
  plannedMeals: PlannedMeal[];
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
  workspace_data: WorkspaceData;
}

 
const { Provider: MealPlanDataProvider, useContextValue: useMealPlanContext } =
  useGenericContext<MealPlanContextProps>();

export { MealPlanDataProvider, useMealPlanContext };
