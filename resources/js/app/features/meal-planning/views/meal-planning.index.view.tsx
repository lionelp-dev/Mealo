import MealPlanCalendar from '../components/meal-plan-calendar';
import { MealPlanGenerationPopover } from '../components/meal-plan-generation-popover';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import WeekSelector from '@/app/components/week-selector';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import AppLayout from '@/app/layouts/app-layout';
import mealPlanningRoute from '@/routes/meal-planning';
import { Head } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export function MealPlanningIndexView() {
  const { t } = useTranslation();

  const { weekStart, workspace_data } = usePlannedMealsContextValue();

  const { canGenerateMealPlan } = useWorkspacePermissions();

  return AppLayout({
    children: (
      <div className="w-full overflow-y-scroll px-4 py-5">
        <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>
        <MealPlanCalendar />
      </div>
    ),
    renderHeaderLeftContent: ({ mobileSidebarTrigger }) => (
      <WeekSelector
        currentWeek={DateTime.fromISO(weekStart)}
        leadingContent={mobileSidebarTrigger}
        url={mealPlanningRoute.index.url()}
      />
    ),
    headerRightContent: (
      <div className="flex items-end gap-2.5 max-lg:flex-col min-lg:flex-row-reverse">
        <NavWorkspaceSwitcher workspace_data={workspace_data} />
        {canGenerateMealPlan && <MealPlanGenerationPopover />}
      </div>
    ),
  });
}
