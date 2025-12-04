import { router } from '@inertiajs/react';
import { useEffect } from 'react';

import {
  CopiedDayPlannedMeals,
  CopiedMealSlot,
  SetDayPlannedMealsProps,
  useWeekPlannedMealsStore,
} from '../stores/week-meal-planner';
import { useMealPlanDialogControllerStore } from '../stores/meal-plan-dialog';

export const useWeekPlannedMeals = ({
  weekStart,
  mealTimes,
  plannedMeals,
}: SetDayPlannedMealsProps) => {
  const weekPlannedMealStore = useWeekPlannedMealsStore();
  const mealPlanDialogStore = useMealPlanDialogControllerStore();

  const { weekPlannedMeals, setWeekPlannedMeals, setCopiedDayPlannedMeals } =
    weekPlannedMealStore;

  useEffect(() => {
    setWeekPlannedMeals({ weekStart, mealTimes, plannedMeals });
  }, [plannedMeals]);

  const unplanMeal = (id: number) => {
    router.delete(`/planned-meals/${id}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['plannedMeals'] });
      },
    });
  };

  const unplanMeals = (ids: number[]) => {
    router.delete(`/planned-meals`, {
      data: { planned_meals: ids },
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['plannedMeals'] });
      },
    });
  };

  const planCopiedDayPlannedMeal = ({
    planned_meals,
  }: CopiedDayPlannedMeals) => {
    router.post(
      '/planned-meals/bulk',
      { planned_meals },
      {
        preserveState: true,
        preserveUrl: true,
        preserveScroll: true,
      },
    );
    setCopiedDayPlannedMeals(null);
  };

  const planSelectedMeals = () => {
    if (mealPlanDialogStore.selectedRecipesId.length === 0 || !mealPlanDialogStore.selectedMealTimeId) {
      return;
    }

    const selectedISODate = mealPlanDialogStore.selectedDate?.toISODate();
    if (!selectedISODate) return;

    const payload: CopiedMealSlot[] = mealPlanDialogStore.selectedRecipesId.map((recipeId) => ({
      recipe_id: recipeId,
      meal_time_id: mealPlanDialogStore.selectedMealTimeId!,
      planned_date: selectedISODate,
    }));

    router.post(
      '/planned-meals/bulk',
      {
        planned_meals: payload,
      },
      { preserveState: true, preserveUrl: true, preserveScroll: true },
    );

    mealPlanDialogStore.clearSelectedRecipes();
    mealPlanDialogStore.closeDialog();
  };

  return {
    ...weekPlannedMealStore,
    ...mealPlanDialogStore,
    weekPlannedMeals,
    planCopiedDayPlannedMeal,
    planSelectedMeals,
    unplanMeal,
    unplanMeals,
  };
};
