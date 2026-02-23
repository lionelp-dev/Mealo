import { useMealPlanContext } from '@/contexts/meal-plan-context';
import { useAppForm } from '@/hooks/form-hook';
import { useMealPlanActions } from '@/hooks/use-meal-plan-actions';
import { cn } from '@/lib/utils';
import { useMealPlanDialogStore } from '@/stores/meal-plan-dialog';
import { useRecipeFiltersStore } from '@/stores/recipe-filters';
import { Recipe } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import {
  CalendarPlus,
  Cookie,
  CookingPot,
  Croissant,
  Info,
  Minus,
  Plus,
  Utensils,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type MealPlanningPopoverProps = {
  recipe: Recipe;
  isMultiSelectMode: boolean;
  isMealPlanningPopoverOpen: boolean;
  setIsMealPlanningPopoverOpen: (value: boolean) => void;
};

type MealPlanningPopoverForm = {
  meal_times: number[];
  servings: number;
};

export default function MealPlanningPopover({
  recipe,
  isMultiSelectMode,
  isMealPlanningPopoverOpen,
  setIsMealPlanningPopoverOpen,
}: MealPlanningPopoverProps) {
  const { t } = useTranslation();

  const { mealTimes } = useMealPlanContext();

  const { planMeals } = useMealPlanActions();

  const { selectedDate, setIsOpen } = useMealPlanDialogStore();

  const { clearAllFilters } = useRecipeFiltersStore();

  const defaultValues: MealPlanningPopoverForm = {
    meal_times: [],
    servings: 1,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!selectedDate) return;

      const data = value as {
        meal_times: number[];
        servings: number;
      };

      await planMeals({
        meals: data.meal_times.map((meal_time) => ({
          recipe_id: recipe.id,
          planned_date: selectedDate.toString(),
          meal_time_id: meal_time,
          serving_size: data.servings,
        })),
        onSuccess() {
          setIsOpen(false);
          clearAllFilters();
        },
      });
      setIsMealPlanningPopoverOpen(false);
    },
  });

  return (
    <Popover.Root
      open={isMealPlanningPopoverOpen}
      onOpenChange={setIsMealPlanningPopoverOpen}
    >
      <Popover.Trigger asChild>
        <button
          className={cn(
            'plan-meal-btn btn absolute top-4 right-3 btn-circle border-base-300/75 opacity-0 btn-lg',
            isMealPlanningPopoverOpen && 'opacity-100',
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMealPlanningPopoverOpen(true);
          }}
          disabled={isMultiSelectMode}
        >
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
            setIsMealPlanningPopoverOpen(false);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col rounded-sm bg-secondary/10 px-4 py-2 text-secondary">
                <span className="text-base font-medium">{recipe.name}</span>
              </div>

              <form.AppField
                name="servings"
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
                    <span className="flex w-full items-center gap-2 rounded-sm bg-secondary/10 px-2.5 py-2 pr-4.5 text-xs text-secondary">
                      <Info className="h-5 w-5" />
                      <span className="pt-[1px]">
                        {t(
                          'mealPlanning.dialog.persons',
                          'Selectioner le(s) repas pour {{count}} personne(s)',
                          {
                            count: field.state.value as number,
                          },
                        )}
                      </span>
                    </span>
                  </div>
                )}
              />

              <div className="flex flex-col gap-2.5">
                <form.AppField
                  name="meal_times"
                  mode="array"
                  children={(field: any) => (
                    <div className="flex flex-col gap-2">
                      {mealTimes.map((mealTime) => {
                        const currentValue =
                          (field.state.value as number[]) || [];
                        const index = currentValue.findIndex(
                          (mt_id) => mt_id === mealTime.id,
                        );

                        return (
                          <label
                            key={mealTime.id}
                            className="btn flex justify-between gap-3 border-base-300/50 px-4 pl-3 text-sm text-secondary transition-colors btn-outline hover:border-secondary/50 hover:bg-secondary/5 disabled:opacity-50"
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
                            <field.CheckboxField
                              className="checkbox checkbox-sm"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.pushValue(mealTime.id as never);
                                } else {
                                  field.removeValue(index);
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              <form.Subscribe>
                {(state: any) => (
                  <button
                    className="btn gap-2 pl-6 btn-secondary"
                    type="button"
                    disabled={!state.canSubmit}
                    onClick={() => {
                      form.handleSubmit();
                    }}
                  >
                    Plannifier
                  </button>
                )}
              </form.Subscribe>
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
