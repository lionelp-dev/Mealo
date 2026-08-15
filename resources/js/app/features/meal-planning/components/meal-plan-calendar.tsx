import { useWeekPlannedMeals } from '../hooks/use-week-meal-plan';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import MealPlanDayHeader from './meal-plan-day-header';
import MealPlanDialog from './meal-plan-dialog';
import { MealPlanRecipeCard } from './meal-plan-dialog-recipe-card';
import MealPlanRecipeDetail from './meal-plan-recipe-detail';
import MealPlanSlots from './meal-plan-slots';
import { RecipeResourceData } from '@/types/generated';
import { InfiniteScroll } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useState } from 'react';

export default function MealPlanCalendar() {
  const { weekPlannedMeals } = useWeekPlannedMeals();
  const { recipes } = usePlannedMealsContextValue();
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeResourceData | null>(null);

  return (
    <div
      className={`grid w-full gap-x-4 gap-y-5 ${
        selectedRecipe
          ? 'grid-cols-[repeat(auto-fit,minmax(19rem,1fr))_25.5vw]'
          : 'grid-cols-[repeat(auto-fit,minmax(19rem,1fr))]'
      }`}
    >
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
      {selectedRecipe && <MealPlanRecipeDetail recipe={selectedRecipe} />}
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
