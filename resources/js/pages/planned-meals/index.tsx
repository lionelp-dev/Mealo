import MealPlanCalendar from '@/components/meal-plan-calendar';
import { MealPlanGenerationPopover } from '@/components/meal-plan-generation-popover';
import { NavWorkspaceSwitcher } from '@/components/nav-workspace-switcher';
import WeekSelector from '@/components/week-selector';
import { MealPlanDataProvider } from '@/contexts/meal-plan-context';
import { RecipeFiltersDataProvider } from '@/contexts/recipe-filters-context';
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
import { DateTime } from 'luxon';
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
        <RecipeFiltersDataProvider data={{ recipes, tags }}>
          <PlannedMealsView />
        </RecipeFiltersDataProvider>
      </WorkspaceDataProvider>
    </MealPlanDataProvider>
  );
}

function PlannedMealsView() {
  const { t } = useTranslation();

  const { weekStart } = usePage<PageProps>().props;

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
        <NavWorkspaceSwitcher />
      </div>
    ),
  });
}
