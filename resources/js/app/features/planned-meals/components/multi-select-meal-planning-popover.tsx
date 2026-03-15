import { useMealPlanActions } from '../hooks/use-meal-plan-actions';
import { usePlannedMealsContextValue } from '../inertia.adapter';
import { useMealPlanDialogStore } from '../stores/meal-plan-dialog';
import { useAppForm } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { useRecipeMultiSelectStore } from '@/app/stores/recipe-multi-select';
import * as Popover from '@radix-ui/react-popover';
import {
  CalendarPlus,
  Cookie,
  CookingPot,
  Croissant,
  Minus,
  Plus,
  Utensils,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type MultiSelectMealPlanningPopoverProps = {
  selectedRecipesId: number[];
  isMultiSelectMealPlanningPopoverOpen: boolean;
  setIsMultiSelectMealPlanningPopoverOpen: (value: boolean) => void;
} & React.ComponentProps<'button'>;

type MealPlanningPopoverForm = {
  meal_times: number[];
  servings: number;
};

export default function MultiSelectMealPlanningPopover({
  selectedRecipesId,
  isMultiSelectMealPlanningPopoverOpen,
  setIsMultiSelectMealPlanningPopoverOpen,
  className,
}: MultiSelectMealPlanningPopoverProps) {
  const { t } = useTranslation();

  const { mealTimes } = usePlannedMealsContextValue();

  const { planMeals } = useMealPlanActions();

  const { selectedDate, setIsOpen } = useMealPlanDialogStore();
  const { clearSelectedRecipes } = useRecipeMultiSelectStore();

  const defaultValues: MealPlanningPopoverForm = {
    meal_times: [],
    servings: 1,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!selectedDate) return;

      const { meal_times, servings } = value as {
        meal_times: number[];
        servings: number;
      };

      const meals = selectedRecipesId.map((recipeId) => ({
        recipe_id: recipeId,
        meal_time_id: meal_times[0],
        planned_date: selectedDate.toString(),
        serving_size: servings,
      }));

      await planMeals({
        meals,
        onSuccess() {
          clearSelectedRecipes();
          setIsOpen(false);
        },
      });

      setIsMultiSelectMealPlanningPopoverOpen(false);
    },
  });

  return (
    <Popover.Root
      open={isMultiSelectMealPlanningPopoverOpen}
      onOpenChange={setIsMultiSelectMealPlanningPopoverOpen}
    >
      <Popover.Trigger asChild>
        <button
          className={cn(
            `btn join items-center rounded-r-full border-base-300/75 btn-secondary`,
            className,
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMultiSelectMealPlanningPopoverOpen(true);
          }}
        >
          <span>Plannifier</span>
          <CalendarPlus size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[10000] gap-3 rounded-lg border border-base-300 bg-base-100 p-3 pb-3.5 shadow-xl"
          side="top"
          align="end"
          sideOffset={8}
          alignOffset={-4}
          onPointerLeave={() => {
            setIsMultiSelectMealPlanningPopoverOpen(false);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-3">
              <form.AppField
                name="servings"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                children={(field: any) => (
                  <div className="-mt-0.5 flex flex-col gap-2.5">
                    <span className="w-full px-2.5 text-sm font-medium whitespace-nowrap text-secondary">
                      {t(
                        'mealPlanning.dialog.persons',
                        'Pour combien de personnes ?',
                      )}
                    </span>
                    <div className="join w-fit shrink-0 items-center gap-2 px-2.5 pb-0.5">
                      <button
                        className="btn join-item rounded-md px-2 btn-outline btn-soft btn-sm btn-secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if ((field.state.value as number) > 1) {
                            field.setValue((field.state.value as number) - 1);
                          }
                        }}
                        children={<Minus className="h-4 w-4" />}
                      />
                      <field.NumberField
                        className="btn join-item w-fit [appearance:textfield] rounded-md px-0 btn-sm [&::-webkit-inner-spin-button]:appearance-none"
                        min={1}
                        max={20}
                      />
                      <button
                        className="btn join-item rounded-md px-2 btn-outline btn-soft btn-sm btn-secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if ((field.state.value as number) < 255) {
                            field.setValue((field.state.value as number) + 1);
                          }
                        }}
                        children={<Plus className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                )}
              />

              <div className="flex flex-col gap-2.5">
                <form.AppField
                  name="meal_times"
                  mode="array"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                  children={(_field: any) => (
                    <div className="flex flex-col gap-2">
                      {mealTimes.map((mealTime) => {
                        return (
                          <form.Subscribe key={mealTime.id}>
                            <button
                              className="btn flex justify-between gap-3 border-base-300/50 px-4 pl-3 text-sm text-secondary transition-colors btn-outline hover:border-secondary/50 hover:bg-secondary/5 disabled:opacity-50"
                              onClick={() => {
                                form.pushFieldValue('meal_times', mealTime.id);
                                form.handleSubmit();
                              }}
                            >
                              <div className="flex gap-3.5">
                                {getMealTimeIcon(mealTime.name)}
                                <span className="pt-[1px]">
                                  {t(
                                    `mealPlanning.dialog.filters.${mealTime.name}`,
                                    mealTime.name,
                                  )}
                                </span>
                              </div>
                            </button>
                          </form.Subscribe>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
          <Popover.Arrow className="fill-base-100 stroke-base-300" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const getMealTimeIcon = (mealTimeName: string): ReactNode => {
  const iconMap: Record<string, ReactNode> = {
    breakfast: <Croissant />,
    lunch: <Utensils />,
    diner: <CookingPot />,
    snack: <Cookie />,
  };
  return iconMap[mealTimeName];
};
