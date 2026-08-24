import { useWeekPlannedMeals } from '../hooks/use-week-meal-plan';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import MealPlanDayHeader from './meal-plan-day-header';
import MealPlanDialog from './meal-plan-dialog';
import { MealPlanRecipeCard } from './meal-plan-dialog-recipe-card';
import MealPlanSlots from './meal-plan-slots';
import RecipeDetailPanel from '@/app/features/recipes/components/recipe-detail-panel';
import RecipeDetailPanelContainer from '@/app/features/recipes/components/recipe-detail-panel-container';
import { useRecipeDetailPanel } from '@/app/features/recipes/hooks/use-recipe-detail-panel';
import { InfiniteScroll } from '@inertiajs/react';
import { DateTime } from 'luxon';

export default function MealPlanCalendar() {
  const { weekPlannedMeals } = useWeekPlannedMeals();
  const { recipes } = usePlannedMealsContextValue();
  const {
    setSelectedRecipe,
    displayedRecipe,
    isRecipeDetailMounted,
    isRecipeDetailVisible,
    closeRecipeDetail,
  } = useRecipeDetailPanel();

  return (
    <div className="flex min-w-0 gap-3 overflow-x-clip">
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-x-4 gap-y-5">
        {weekPlannedMeals.map((dayPlannedMeals) => {
          const { date } = dayPlannedMeals;
          const isToday = date.hasSame(DateTime.now(), 'day');
          return (
            <div
              key={date.toISODate()}
              id={isToday ? 'today' : ''}
              className="flex w-full min-w-0 [scroll-margin-top:28px] flex-col gap-5"
            >
              <MealPlanDayHeader dayPlannedMeals={dayPlannedMeals} />
              <MealPlanSlots
                dayPlannedMeals={dayPlannedMeals}
                onSelectRecipe={setSelectedRecipe}
              />
            </div>
          );
        })}
      </div>
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
      <MealPlanDialog>
        <div className="overflow-y-scroll">
          <InfiniteScroll data="recipes">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4 gap-y-5 p-1">
              {recipes.data.map((recipe) => {
                return <MealPlanRecipeCard key={recipe.id} recipe={recipe} />;
              })}
            </div>
          </InfiniteScroll>
        </div>
      </MealPlanDialog>
    </div>
  );
}
