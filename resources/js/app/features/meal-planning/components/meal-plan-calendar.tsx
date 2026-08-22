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
import { useCallback, useEffect, useRef, useState } from 'react';

export default function MealPlanCalendar() {
  const { weekPlannedMeals } = useWeekPlannedMeals();
  const { recipes } = usePlannedMealsContextValue();
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeResourceData | null>(null);
  const [isRecipeDetailMounted, setIsRecipeDetailMounted] = useState(false);
  const [isRecipeDetailVisible, setIsRecipeDetailVisible] = useState(false);

  const handleCloseRecipeDetail = useCallback(
    () => setSelectedRecipe(null),
    [],
  );

  // Keep the last recipe mounted so its content stays visible while the panel
  // animates closed.
  const lastRecipeRef = useRef<RecipeResourceData | null>(null);
  if (selectedRecipe) {
    lastRecipeRef.current = selectedRecipe;
  }
  const displayedRecipe = selectedRecipe ?? lastRecipeRef.current;

  useEffect(() => {
    if (selectedRecipe) {
      setIsRecipeDetailMounted(true);
      const animationFrameId = window.requestAnimationFrame(() => {
        setIsRecipeDetailVisible(true);
      });

      return () => window.cancelAnimationFrame(animationFrameId);
    }

    setIsRecipeDetailVisible(false);

    if (!isRecipeDetailMounted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsRecipeDetailMounted(false);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [isRecipeDetailMounted, selectedRecipe]);

  return (
    <div className="flex gap-3">
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
      {isRecipeDetailMounted && (
        <div className="sticky top-0 h-[90.45vh] w-[22vw] shrink-0 overflow-hidden">
          <div
            className={`h-full transition-[opacity,transform] duration-300 ease-in-out ${
              isRecipeDetailVisible
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-4 opacity-0'
            }`}
          >
            {displayedRecipe && (
              <MealPlanRecipeDetail
                recipe={displayedRecipe}
                onClose={handleCloseRecipeDetail}
              />
            )}
          </div>
        </div>
      )}
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
