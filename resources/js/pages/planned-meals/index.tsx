import { PlannedMealsInertiaAdapter } from '@/app/features/planned-meals/inertia.adapter';
import { PlannedMealsIndexView } from '@/app/features/planned-meals/views/planned-meals.index.view';

export default function PlannedMeals() {
  return (
    <PlannedMealsInertiaAdapter>
      <PlannedMealsIndexView />
    </PlannedMealsInertiaAdapter>
  );
}
