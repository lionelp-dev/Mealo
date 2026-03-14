import { PlannedMealsInertiaAdapter } from '@/features/planned-meals/inertia.adapter';
import { PlannedMealsIndexView } from '@/features/planned-meals/views/planned-meals.index.view';

export default function PlannedMeals() {
  return (
    <PlannedMealsInertiaAdapter>
      <PlannedMealsIndexView />
    </PlannedMealsInertiaAdapter>
  );
}
