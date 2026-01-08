import { DateTime } from 'luxon';

import { InfiniteScroll } from '@inertiajs/react';
import { useMealPlanData } from '../hooks/use-meal-plan-data';
import MealPlanDayHeader from './meal-plan-day-header';
import MealPlanDialog from './meal-plan-dialog';
import { MealPlanRecipeCard } from './meal-plan-dialog-recipe-card';
import MealPlanSlots from './meal-plan-slots';

export default function MealPlanCalendar() {
  const { weekPlannedMeals, recipes } = useMealPlanData();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(22.5rem,1fr))] gap-x-5 gap-y-6">
      {weekPlannedMeals.map((dayPlannedMeals) => {
        const { date } = dayPlannedMeals;
        const isToday = date.hasSame(DateTime.now(), 'day');
        return (
          <div
            key={date.toISODate()}
            id={isToday ? 'today' : ''}
            className="flex [scroll-margin-top:28px] flex-col gap-5"
          >
            <MealPlanDayHeader dayPlannedMeals={dayPlannedMeals} />
            <MealPlanSlots dayPlannedMeals={dayPlannedMeals} />
          </div>
        );
      })}
      <MealPlanDialog>
        <div className="overflow-y-scroll">
          <InfiniteScroll data="recipes">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4 gap-y-5 p-1">
              {recipes.data.map((recipe) => {
                return <MealPlanRecipeCard recipe={recipe} key={recipe.id} />;
              })}
            </div>
          </InfiniteScroll>
        </div>
      </MealPlanDialog>
    </div>
  );
}
