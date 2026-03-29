import { router } from '@inertiajs/react';

export function useMealPlanActions() {
  const planMeals = async ({
    meals,
    onSuccess,
  }: {
    meals: {
      recipe_id: string;
      meal_time_id: number;
      planned_date: string;
      serving_size: number;
    }[];
    onSuccess?: () => void;
  }) => {
    router.post(
      '/planned-meals',
      { planned_meals: meals },
      {
        preserveState: true,
        preserveUrl: true,
        preserveScroll: true,
        only: ['plannedMeals', 'flash'],
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
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

  return {
    planMeals,
    unplanMeals,
  };
}
