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
import { useMealPlanNavigation } from '../hooks/use-meal-plan-navigation';
import { useWeekPlannedMeals } from '../hooks/use-week-meal-plan';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import WeekSelector from '@/app/components/week-selector';
import { useWorkspacePermissions } from '@/app/hooks/use-workspace-permissions';
import AppLayout from '@/app/layouts/app-layout';
import { Head, InfiniteScroll } from '@inertiajs/react';
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
    scrollToDay,
  } = useMealPlanDayNavigation(weekStart);

  const { currentWeek, goToToday, goToPreviousWeek, goToNextWeek } =
    useMealPlanNavigation({
      scrollToDay,
      weekStart,
    });

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
        currentWeek={currentWeek}
        leadingContent={mobileSidebarTrigger}
        onTodayClick={goToToday}
        onPreviousWeekClick={goToPreviousWeek}
        onNextWeekClick={goToNextWeek}
      />
    ),
    headerRightContent: (
      <div className="flex items-end gap-2.5 max-lg:flex-col min-lg:flex-row-reverse">
        <NavWorkspaceSwitcher workspace_data={workspace_data} />
        {canGenerateMealPlan && <MealPlanGenerationPopover />}
      </div>
    ),
    children: (
      <div
        ref={contentRef}
        className="min-h-0 w-full max-w-full min-w-0 flex-1 overflow-y-auto"
      >
        <div className="m-auto w-full max-w-[1800px] min-w-0 md:px-5 md:pt-2 min-md:pb-5">
          <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>

          <MealPlanningDayNavigator
            activeDayId={activeDayId}
            days={weekPlannedMeals}
            onSelectDay={scrollToDay}
            stickyRef={stickyRef}
          />

          <div className="flex w-full max-w-full min-w-0 gap-3 overflow-x-clip">
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
              className={`grid min-w-0 flex-1 grid-cols-1 gap-x-3 gap-y-5 px-2.75 md:px-5 lg:grid-cols-2 ${
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
                    className="flex w-full min-w-0 flex-col gap-3 rounded-xl bg-white pb-3"
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
                  <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-x-5.25 gap-y-5">
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
      </div>
    ),
  });
}
