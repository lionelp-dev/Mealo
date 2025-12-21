import { router } from '@inertiajs/react';
import { useMealPlanData } from './use-meal-plan-data';
import { useWeekPlannedMealsStore } from '../stores/week-meal-planner';
import { 
  DayPlannedMeals,
  CopiedMealSlot,
  CopiedDayPlannedMeals 
} from '../stores/week-meal-planner';

const prepareMealSlotsForCopy = (
  dayPlannedMeals: DayPlannedMeals,
): CopiedMealSlot[] => {
  return dayPlannedMeals.plannedMealsSlots
    .flatMap((slot) => slot.plannedMeals)
    .map((plannedMeal) => ({
      recipe_id: plannedMeal.recipe.id,
      meal_time_id: plannedMeal.meal_time_id,
      planned_date: plannedMeal.planned_date,
    }));
};

const preparePastePayload = (
  copiedMeals: CopiedDayPlannedMeals,
  targetDate: string,
): CopiedDayPlannedMeals => ({
  planned_meals: copiedMeals.planned_meals.map((plannedMeal) => ({
    ...plannedMeal,
    planned_date: targetDate,
  })),
});

export function useMealPlanDayActions(dayPlannedMeals: DayPlannedMeals) {
  const { setCopiedDayPlannedMeals, copiedDayPlannedMeals } = useWeekPlannedMealsStore();

  const handleCopy = () => {
    if (dayPlannedMeals) {
      const mealsSlots = prepareMealSlotsForCopy(dayPlannedMeals);
      setCopiedDayPlannedMeals({ planned_meals: mealsSlots });
    }
  };

  const handlePaste = () => {
    const isoDate = dayPlannedMeals.date.toISODate();
    if (!isoDate || !copiedDayPlannedMeals) return;

    const payload = preparePastePayload(copiedDayPlannedMeals, isoDate);
    
    router.post(
      '/planned-meals/bulk',
      { planned_meals: payload.planned_meals },
      {
        preserveUrl: true,
        preserveState: true,
        preserveScroll: true,
      },
    );
    setCopiedDayPlannedMeals(null);
  };

  const handleDeleteAll = () => {
    const plannedMealsId = dayPlannedMeals?.plannedMealsSlots.flatMap((slot) =>
      slot.plannedMeals.map((plannedMeal) => plannedMeal.id),
    );
    
    if (plannedMealsId && plannedMealsId.length > 0) {
      router.delete(`/planned-meals`, {
        data: { planned_meals: plannedMealsId },
        preserveUrl: true,
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ['plannedMeals'] });
        },
      });
    }
  };

  const handleUnplanMeal = (id: number) => {
    router.delete(`/planned-meals/${id}`, {
      preserveUrl: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['plannedMeals'] });
      },
    });
  };

  return {
    copiedDayPlannedMeals,
    handleCopy,
    handlePaste,
    handleDeleteAll,
    handleUnplanMeal,
  };
}