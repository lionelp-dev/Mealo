import RecipeDetailPanel from '../../recipes/components/recipe-detail-panel';
import RecipeDetailPanelContainer from '../../recipes/components/recipe-detail-panel-container';
import { useRecipeDetailPanel } from '../../recipes/hooks/use-recipe-detail-panel';
import MealPlanDayHeader from '../components/meal-plan-day-header';
import MealPlanDialog from '../components/meal-plan-dialog';
import { MealPlanRecipeCard } from '../components/meal-plan-dialog-recipe-card';
import { MealPlanGenerationPopover } from '../components/meal-plan-generation-popover';
import MealPlanSlots from '../components/meal-plan-slots';
import MealPlanningDayNavigator from '../components/meal-planning-day-navigator';
import { useMealPlanDayNavigation } from '../hooks/use-meal-plan-day-navigation';
import { useWeekPlannedMeals } from '../hooks/use-week-meal-plan';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import WeekSelector from '@/app/components/week-selector';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import AppLayout from '@/app/layouts/app-layout';
import { cn } from '@/app/lib';
import mealPlanningRoute from '@/routes/meal-planning';
import { Head, InfiniteScroll } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export function MealPlanningIndexView() {
  const { t } = useTranslation();

  const { weekStart, workspace_data } = usePlannedMealsContextValue();

  const { canGenerateMealPlan } = useWorkspacePermissions();

  const { weekPlannedMeals } = useWeekPlannedMeals();

  const { recipes } = usePlannedMealsContextValue();

  const {
    activeDayId,
    stickyRef,
    stickyHeight,
    lastDayMinHeight,
    contentRef,
    handleSelectDay,
  } = useMealPlanDayNavigation(weekStart);

  const {
    setSelectedRecipe,
    displayedRecipe,
    isRecipeDetailMounted,
    isRecipeDetailVisible,
    closeRecipeDetail,
  } = useRecipeDetailPanel();

  return AppLayout({
    renderHeaderLeftContent: ({ mobileSidebarTrigger }) => (
      <WeekSelector
        currentWeek={DateTime.fromISO(weekStart)}
        url={mealPlanningRoute.index.url()}
        leadingContent={mobileSidebarTrigger}
      />
    ),
    headerRightContent: (
      <div className="flex items-end gap-2.5 max-lg:flex-col min-lg:flex-row-reverse">
        <NavWorkspaceSwitcher workspace_data={workspace_data} />
        {canGenerateMealPlan && <MealPlanGenerationPopover />}
      </div>
    ),
    children: (
      <div ref={contentRef} className="min-h-0 w-full flex-1 overflow-y-auto">
        <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>

        <MealPlanningDayNavigator
          activeDayId={activeDayId}
          days={weekPlannedMeals}
          onSelectDay={handleSelectDay}
          stickyRef={stickyRef}
        />

        <div className="flex min-w-0 gap-3 overflow-x-clip">
          <RecipeDetailPanelContainer
            isMounted={isRecipeDetailMounted}
            isVisible={isRecipeDetailVisible}
          >
            {displayedRecipe && (
              <RecipeDetailPanel
                recipe={displayedRecipe}
                onClose={closeRecipeDetail}
              />
            )}
          </RecipeDetailPanelContainer>

          <div
            className={`grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-2 ${
              isRecipeDetailMounted ? '2xl:grid-cols-2' : '2xl:grid-cols-4'
            }`}
          >
            {weekPlannedMeals.map((dayPlannedMeals, index) => {
              const { date } = dayPlannedMeals;
              const dayId = date.toISODate();
              const isLastDay = index === weekPlannedMeals.length - 1;

              return (
                <div
                  key={dayId}
                  className={cn('flex w-full min-w-0 flex-col gap-3')}
                  style={
                    isLastDay && lastDayMinHeight
                      ? { minHeight: lastDayMinHeight }
                      : undefined
                  }
                >
                  {dayId && (
                    <div
                      id={`planning-day-marker-${dayId}`}
                      aria-hidden="true"
                      className="-mb-px h-px"
                      style={{
                        scrollMarginTop: stickyHeight || undefined,
                      }}
                    />
                  )}
                  <MealPlanDayHeader dayPlannedMeals={dayPlannedMeals} />
                  <MealPlanSlots
                    dayPlannedMeals={dayPlannedMeals}
                    onSelectRecipe={setSelectedRecipe}
                  />
                </div>
              );
            })}
          </div>

          <MealPlanDialog>
            <div className="overflow-y-scroll">
              <InfiniteScroll data="recipes">
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4 gap-y-5 p-1">
                  {recipes.data.map((recipe) => {
                    return (
                      <MealPlanRecipeCard key={recipe.id} recipe={recipe} />
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
          </MealPlanDialog>
        </div>
      </div>
    ),
  });
}
