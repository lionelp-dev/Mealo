import { createContext, useContext } from 'react';
import { MealTime, PlannedMeal, PaginatedCollection, Recipe, Tag } from '../types';

export interface MealPlanContextData {
  weekStart: string;
  mealTimes: MealTime[];
  plannedMeals: PlannedMeal[];
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
}

export const MealPlanContext = createContext<MealPlanContextData | null>(null);

interface MealPlanProviderProps {
  children: React.ReactNode;
  data: MealPlanContextData;
}

export function MealPlanProvider({ children, data }: MealPlanProviderProps) {
  return (
    <MealPlanContext.Provider value={data}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlanContext() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlanContext must be used within MealPlanProvider');
  }
  return context;
}