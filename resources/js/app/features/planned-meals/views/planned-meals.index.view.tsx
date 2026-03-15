import MealPlanCalendar from '../components/meal-plan-calendar';
import { MealPlanGenerationPopover } from '../components/meal-plan-generation-popover';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import WeekSelector from '@/app/components/week-selector';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import AppLayout from '@/app/layouts/app-layout';
import plannedMealsRoute from '@/routes/planned-meals';
import { Head } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export function PlannedMealsIndexView() {
  const { t } = useTranslation();

  const { weekStart, workspace_data } = usePlannedMealsContextValue();

  const { canGenerateMealPlan } = useWorkspacePermissions();

  return AppLayout({
    children: (
      <div className="w-full overflow-y-scroll py-7 pr-6 pl-7.5">
        <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>
        <MealPlanCalendar />
      </div>
    ),
    headerLeftContent: (
      <div className="flex items-center gap-4">
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={plannedMealsRoute.index.url()}
        />
      </div>
    ),
    headerRightContent: (
      <div className="flex items-center gap-4">
        {canGenerateMealPlan && <MealPlanGenerationPopover />}
        <NavWorkspaceSwitcher workspace_data={workspace_data} />
      </div>
    ),
  });
}
