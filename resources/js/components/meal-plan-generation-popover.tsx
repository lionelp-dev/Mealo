import { useMealPlanGeneration } from '@/hooks/use-meal-plan-generation';
import * as Popover from '@radix-ui/react-popover';
import { Bot, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MealPlanGenerationPopover() {
  const { t } = useTranslation();
  const {
    isGenerating,
    startDate,
    setStartDate,
    days,
    setDays,
    handleGeneratePlan,
    isOpen,
    setIsOpen,
  } = useMealPlanGeneration();

  return (
    <>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="btn gap-2 pl-5">
            {t('mealPlanning.generatePlan', 'Generate Plan')}
            {isGenerating ? (
              <span className="loading loading-sm loading-spinner"></span>
            ) : (
              <Bot className="h-4.5 w-4.5" />
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-10 flex w-80 rounded-md border border-base-300 bg-base-100 p-4"
            align="end"
            sideOffset={7}
          >
            <div className="flex flex-col gap-4">
              <h4 className="text-lg leading-none font-medium">
                {t('mealPlanning.generatePlanTitle', 'Generate your meal plan')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  'mealPlanning.generatePlanDescription',
                  'Automatically create a balanced meal plan with your existing recipes.',
                )}
              </p>

              <h3 className="text-md leading-none font-medium">
                {t('mealPlanning.planningPeriod', 'Planning period')}
              </h3>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                  {t('mealPlanning.startDate', 'Start date')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input input-sm w-full"
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <label className="text-sm font-medium">
                  {t('mealPlanning.numberOfDays', 'Number of days')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="text-black-300 range [--range-fill:0] [--range-thumb:black] range-sm"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="input input-sm w-16 text-center"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t('mealPlanning.days', 'days')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="btn w-full"
              >
                {t('mealPlanning.generateNow', 'Generate my meal plan')}
                {isGenerating ? (
                  <span className="loading loading-sm loading-spinner"></span>
                ) : (
                  <ChefHat className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
