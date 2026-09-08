import MealPlanEmptySlot from './meal-plan-empty-slot';
import MealPlanMealCard from './meal-plan-meal-card';
import { DayPlannedMeals } from '@/types';
import { RecipeResourceData } from '@/types/generated';

type MealPlanProps = {
  dayPlannedMeals: DayPlannedMeals;
  onSelectRecipe: (recipe: RecipeResourceData) => void;
};

export default function MealPlanSlots({
  dayPlannedMeals,
  onSelectRecipe,
}: MealPlanProps) {
  const { date, plannedMealsSlots } = dayPlannedMeals;

  return (
    <div className="w-full overflow-hidden lg:h-[60vh]">
      <div className="h-full w-full md:overflow-scroll">
        <div className="flex h-full w-full min-w-0 flex-col gap-6">
          {plannedMealsSlots.length > 0 && (
            <div className="flex w-full min-w-0 flex-col gap-6">
              {plannedMealsSlots.map(({ mealTime, plannedMeals }) => {
                return (
                  <div
                    key={mealTime.id}
                    className="flex w-full min-w-0 flex-col justify-between gap-3.25"
                  >
                    {plannedMeals.map((plannedMeal) => (
                      <MealPlanMealCard
                        key={plannedMeal.id}
                        plannedMeal={plannedMeal}
                        onSelectRecipe={onSelectRecipe}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          <MealPlanEmptySlot date={date} />
        </div>
      </div>
    </div>
  );
}
