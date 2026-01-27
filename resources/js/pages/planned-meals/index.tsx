import MealPlanCalendar from '@/components/meal-plan-calendar';
import { MealPlanGenerationPopover } from '@/components/meal-plan-generation-popover';
import WeekSelector from '@/components/week-selector';
import WorkspaceCreationModal from '@/components/workspace-creation-modal';
import { WorkspaceInvitationModal } from '@/components/workspace-invitation-modal';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { MealPlanDataProvider } from '@/contexts/meal-plan-context';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions';
import AppLayout from '@/layouts/app-layout';
import plannedMealsRoute from '@/routes/planned-meals';

import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  SharedData,
  Tag,
  WorkspaceData,
} from '@/types';

import { Head, usePage, usePoll } from '@inertiajs/react';
import { DateTime, Settings } from 'luxon';
import { useTranslation } from 'react-i18next';

type PageProps = {
  weekStart: string;
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
  recipes: PaginatedCollection<Recipe>;
  workspace_data: WorkspaceData;
  tags: Tag[];
} & SharedData;

export default function PlannedMeals() {
  const { weekStart, mealTimes, plannedMeals, recipes, tags, workspace_data } =
    usePage<PageProps>().props;

  usePoll(3000, {
    only: ['plannedMeals'],
  });

  return (
    <MealPlanDataProvider
      data={{
        weekStart,
        mealTimes,
        plannedMeals,
        workspace_data,
        recipes,
        tags,
      }}
    >
      <WorkspaceDataProvider data={{ workspace_data }}>
        <PlannedMealsView />
      </WorkspaceDataProvider>
    </MealPlanDataProvider>
  );
}

function PlannedMealsView() {
  const { t, i18n } = useTranslation();

  const { weekStart } = usePage<PageProps>().props;

  const { canGenerateMealPlan } = useWorkspacePermissions();

  // Set Luxon locale based on i18n language
  Settings.defaultLocale = i18n.language;

  return AppLayout({
    children: (
      <>
        <div className="w-full overflow-y-scroll py-7 pr-6 pl-7.5">
          <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>
          <MealPlanCalendar />
        </div>
        <WorkspaceInvitationModal />
        <WorkspaceCreationModal />
      </>
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
        <WorkspaceSwitcher />
        {canGenerateMealPlan && <MealPlanGenerationPopover />}
      </div>
    ),
  });
}
