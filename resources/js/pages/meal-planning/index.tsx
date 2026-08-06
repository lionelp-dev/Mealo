import { MealPlanningInertiaAdapter } from '@/app/features/meal-planning/inertia.adapter';
import { MealPlanningIndexView } from '@/app/features/meal-planning/views/meal-planning.index.view';

export default function MealPlanning() {
  return (
    <MealPlanningInertiaAdapter>
      <MealPlanningIndexView />
    </MealPlanningInertiaAdapter>
  );
}
