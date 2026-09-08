import { cn } from '@/app/lib';
import { DayPlannedMeals } from '@/types';
import { DateTime } from 'luxon';
import { type RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type MealPlanningDayNavigatorProps = {
  activeDayId: string | null;
  days: DayPlannedMeals[];
  onSelectDay: (dayId: string) => void;
  stickyRef: RefObject<HTMLDivElement | null>;
};

export default function MealPlanningDayNavigator({
  activeDayId,
  days,
  onSelectDay,
  stickyRef,
}: MealPlanningDayNavigatorProps) {
  const { i18n } = useTranslation();

  const handleDayClick = useCallback(
    (day: DayPlannedMeals) => {
      const dayId = day.date.toISODate();

      if (!dayId) return;

      onSelectDay(dayId);
    },
    [onSelectDay],
  );

  return (
    <div
      ref={stickyRef}
      className="sticky top-0 z-10 bg-base-100 px-2 md:hidden"
    >
      <div className="h-fit border-b border-base-content/5 backdrop-blur supports-[backdrop-filter]:bg-base-100/80">
        <div className="overflow-x-auto px-0.25 py-1.5">
          <div className="flex min-w-max snap-x justify-center gap-3 px-1">
            {days.map((day) => {
              const localizedDate = day.date.setLocale(i18n.language);
              const dayId = day.date.toISODate();
              const dayKey = dayId ?? day.date.toMillis().toString();
              const isActive = dayId === activeDayId;
              const isToday = day.date.hasSame(DateTime.now(), 'day');
              const weekdayLabel = localizedDate
                .toFormat('ccc')
                .replace(/\.$/, '');
              const ariaLabel = localizedDate.toLocaleString({
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              });

              return (
                <button
                  key={dayKey}
                  type="button"
                  className={cn(
                    'btn relative shrink-0 snap-start border border-base-content/5 px-2.75 py-6.25',
                    'flex-col gap-1.5 text-[13px] leading-none btn-xs',
                    isToday
                      ? 'text-secondary-content shadow-sm btn-secondary'
                      : 'bg-base-200/60 text-base-content/75 btn-soft hover:bg-base-200',
                    isActive &&
                      'outline-2 outline-offset-2 outline-secondary/70',
                  )}
                  onClick={() => handleDayClick(day)}
                  aria-label={ariaLabel}
                  aria-current={isActive ? 'date' : undefined}
                >
                  <span className="text-[12px] font-medium tracking-[0.1em] opacity-80">
                    {weekdayLabel}
                  </span>
                  <span className="font-semibold">{day.date.day}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
