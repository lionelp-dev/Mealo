import { useMealPlanGeneration } from '../hooks/use-meal-plan-generation';
import { useAppForm } from '@/app/hooks/form-hook';
import plannedMeals from '@/routes/planned-meals';
import { router, usePage } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import 'cally';
import { Bot, CalendarRange, Minus, Plus } from 'lucide-react';
import { DateTime, Interval } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type MealPlanGenerationForm = {
  range: {
    startDate: DateTime;
    endDate: DateTime;
  };
  serving_size: number;
};

export function MealPlanGenerationPopover() {
  const { t } = useTranslation();

  const { weekStart } = usePage<{ weekStart: string }>().props;

  const { isGenerating, setIsGenerating, isOpen, setIsOpen } =
    useMealPlanGeneration();

  const defaultValues: MealPlanGenerationForm = {
    range: {
      startDate: DateTime.fromISO(weekStart),
      endDate: DateTime.fromISO(weekStart).endOf('week'),
    },
    serving_size: 1,
  };

  const [isCalendarRangeIsOpen, setCalendarRangeIsOpen] =
    useState<boolean>(false);

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      router.post(
        plannedMeals.generate.url(),
        {
          startDate: value.range.startDate.toISODate(),
          endDate: value.range.endDate.toISODate(),
          serving_size: value.serving_size,
        },
        {
          onStart: () => {
            setIsGenerating(true);
            setIsOpen(false);
          },
          onFinish: () => {
            setIsGenerating(false);
          },
          onError: () => {
            setIsGenerating(false);
          },
        },
      );
    },
  });

  return (
    <>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="btn gap-2 border border-secondary/40 pl-5 btn-outline btn-soft btn-secondary">
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
            className="z-10 flex w-90 rounded-md border border-base-300 bg-base-100 p-4 text-secondary"
            align="end"
            sideOffset={7}
          >
            <div className="flex w-full flex-col gap-4">
              <h4 className="text-lg leading-none font-medium">
                {t('mealPlanning.generatePlanTitle', 'Generate your meal plan')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  'mealPlanning.generatePlanDescription',
                  'Automatically create a balanced meal plan with your existing recipes.',
                )}
              </p>

              <form.AppField
                name="serving_size"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                children={(field: any) => (
                  <div className="-mt-0.5 flex flex-col gap-2.5">
                    <span className="w-full text-base font-medium whitespace-nowrap text-secondary">
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

              <div className="flex flex-col gap-3">
                <h3 className="text-base leading-none font-medium text-secondary">
                  {t('mealPlanning.planningPeriod', 'Planning period')}
                </h3>
                <form.Field name="range">
                  {(field) => {
                    const startDate = form.state.values.range.startDate;
                    const endDate = form.state.values.range.endDate;
                    const interval = Math.ceil(
                      Interval.fromDateTimes(startDate, endDate).length(
                        'days',
                      ) + 1,
                    );

                    return (
                      <Popover.Root
                        open={isCalendarRangeIsOpen}
                        onOpenChange={setCalendarRangeIsOpen}
                      >
                        <Popover.Trigger asChild>
                          <div className="flex items-center gap-2 text-base-content">
                            <button className="input-bordered input w-fit justify-between gap-2 pl-4 text-left">
                              {DateTime.isDateTime(startDate) &&
                              DateTime.isDateTime(endDate)
                                ? `${startDate.toLocaleString(DateTime.DATE_MED)} → ${endDate.toLocaleString(DateTime.DATE_MED)}`
                                : 'Pick a date range'}
                              <CalendarRange className="h-5" />
                            </button>
                            <span className="text- text-sm whitespace-nowrap">
                              {'/ '}
                              {interval}
                              {' Jours'}
                            </span>
                          </div>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            className="z-20 flex flex-col gap-2 rounded-md border border-base-300 bg-base-100 p-3 shadow-lg"
                            align="end"
                            alignOffset={90}
                            side="bottom"
                            sideOffset={5}
                            onPointerDownOutside={(e) => e.stopPropagation()}
                          >
                            <calendar-range
                              className="cally [&_::part(button_day_today)]:bg-inherit [&_::part(button_day_today)]:text-base-content [&_::part(day):disabled]:bg-secondary/15 [&_::part(day):hover]:bg-secondary/20 [&_::part(selected)]:bg-secondary [&_::part(selected)]:text-secondary-content [&_::part(selected):hover]:bg-secondary/20"
                              months={1}
                              min={
                                DateTime.fromISO(weekStart).toISODate() ??
                                undefined
                              }
                              max={
                                DateTime.fromISO(weekStart)
                                  .endOf('week')
                                  .toISODate() ?? undefined
                              }
                              value={[
                                field.state.value.startDate.toISODate(),
                                field.state.value.endDate.toISODate(),
                              ].join('/')}
                              onchange={(event) => {
                                const target = event.target as EventTarget & {
                                  value: string;
                                };
                                const rangeValue = target.value;

                                if (rangeValue && rangeValue.includes('/')) {
                                  const [start, end] = rangeValue.split('/');
                                  field.setValue({
                                    startDate: DateTime.fromISO(start),
                                    endDate: DateTime.fromISO(end),
                                  });
                                }
                              }}
                            >
                              <svg
                                aria-label="Previous"
                                className="size-4 fill-current"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                {...({ slot: 'previous' } as any)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M15.75 19.5 8.25 12l7.5-7.5"
                                ></path>
                              </svg>
                              <svg
                                aria-label="Next"
                                className="size-4 fill-current"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                {...({ slot: 'next' } as any)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                ></path>
                              </svg>
                              <calendar-month></calendar-month>
                            </calendar-range>
                            <button
                              className="btn w-full btn-secondary"
                              onClick={() => setCalendarRangeIsOpen(false)}
                            >
                              Valider
                            </button>
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    );
                  }}
                </form.Field>
              </div>

              <button
                onClick={() => form.handleSubmit()}
                disabled={isGenerating}
                className="btn w-full border-secondary/20 btn-soft btn-secondary"
              >
                {t('mealPlanning.generateNow', 'Generate my meal plan')}
                {isGenerating && (
                  <span className="loading loading-sm loading-spinner"></span>
                )}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {isGenerating && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
          <span className="loading loading-xl loading-spinner"></span>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">
              {t(
                'mealPlanning.generatingPlan',
                'Génération de votre plan de repas en cours',
              )}
            </p>
            <p className="text text-white/60">
              {t(
                'mealPlanning.estimatedTime',
                'Cela peut prendre quelques instants',
              )}{' '}
              <span className="loading loading-xs loading-dots"></span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
