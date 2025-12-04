import MealPlanCalendar from '@/components/meal-plan-calendar';
import MealPlanCalendarControls from '@/components/meal-plan-calendar-controls';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PlannedMeals() {
  return (
    <AppLayout headerLeftContent={<MealPlanCalendarControls />}>
      <div className="overflow-y-scroll px-6">
        <Head title="My recipes"></Head>
        <MealPlanCalendar />
      </div>
    </AppLayout>
  );
}
