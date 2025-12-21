import { router } from '@inertiajs/react';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import {
  CopiedDayPlannedMeals,
  CopiedMealSlot,
  useWeekPlannedMealsStore,
} from '../stores/week-meal-planner';

export const useWeekPlannedMeals = () => {
  const weekPlannedMealStore = useWeekPlannedMealsStore();
  const mealPlanDialogStore = useMealPlanDialogStore();

  const { setCopiedDayPlannedMeals } = weekPlannedMealStore;

  const unplanMeal = (id: number) => {
    router.delete(`/planned-meals/${id}`, {
      preserveUrl: true,
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
      preserveUrl: true,
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
        preserveUrl: true,
        preserveState: true,
        preserveScroll: true,
      },
    );
    setCopiedDayPlannedMeals(null);
  };

  const planSelectedMeals = () => {
    if (
      mealPlanDialogStore.selectedRecipesId.length === 0 ||
      !mealPlanDialogStore.selectedMealTimeId
    ) {
      return;
    }

    const selectedISODate = mealPlanDialogStore.selectedDate?.toISODate();
    if (!selectedISODate) return;

    const payload: CopiedMealSlot[] = mealPlanDialogStore.selectedRecipesId.map(
      (recipeId) => ({
        recipe_id: recipeId,
        meal_time_id: mealPlanDialogStore.selectedMealTimeId!,
        planned_date: selectedISODate,
      }),
    );

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
    planCopiedDayPlannedMeal,
    planSelectedMeals,
    unplanMeal,
    unplanMeals,
  };
};
