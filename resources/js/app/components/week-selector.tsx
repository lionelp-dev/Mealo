import { useWeekSelector } from '@/app/hooks/use-week-selector';
import { cn } from '@/app/lib';
import { ClassValue } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type WeekSelectorProps = {
  currentWeek: DateTime;
  leadingContent?: ReactNode;
  className?: ClassValue;
  url: string;
};

export default function WeekSelector({
  currentWeek,
  leadingContent,
  url,
  className,
}: WeekSelectorProps) {
  const { t, i18n } = useTranslation();

  const weekStart = currentWeek.startOf('week').setLocale(i18n.language);
  const endOfWeek = currentWeek.endOf('week').setLocale(i18n.language);
  const mobileLabel = weekStart.toLocaleString({
    month: 'short',
    year: 'numeric',
  });
  const desktopLabel =
    weekStart.month === endOfWeek.month && weekStart.year === endOfWeek.year
      ? `${weekStart.toFormat('d')} - ${endOfWeek.toFormat('d')} ${weekStart.toLocaleString(
          {
            month: 'long',
            year: 'numeric',
          },
        )}`
      : `${weekStart.toFormat('d')} ${weekStart.toLocaleString({
          month: 'long',
          year: 'numeric',
        })} - ${endOfWeek.toFormat('d')} ${endOfWeek.toLocaleString({
          month: 'long',
          year: 'numeric',
        })}`;

  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url,
  });

  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-end gap-2 gap-x-5 max-lg:flex-wrap min-lg:items-center',
        className,
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-4 min-lg:order-2">
        {leadingContent}

        <span className="min-w-0 truncate text-2xl font-semibold text-base-content/80 capitalize max-lg:pl-2.5">
          <span className="truncate lg:hidden">{mobileLabel}</span>
          <span className="truncate max-lg:hidden">{desktopLabel}</span>
        </span>

        <span className="badge self-center rounded-full badge-soft badge-outline border-secondary/40 badge-sm py-[10.5px] whitespace-nowrap badge-secondary max-md:hidden">
          {t('mealPlanning.weekSelector.week', 'Week')}{' '}
          {currentWeek.weekNumber.toString().padStart(2, '0')}
        </span>
      </div>

      <div className={cn('flex gap-1.5', 'min-lg:order-1 min-lg:gap-2.75')}>
        <button
          className={cn('btn btn-soft max-sm:btn-sm', 'max-lg:order-3')}
          onClick={goToCurrentWeek}
        >
          {t('mealPlanning.weekSelector.today', 'Today')}
        </button>
        <button
          className="btn join-item px-2 btn-soft max-md:btn-sm min-md:px-3"
          onClick={goToPreviousWeek}
        >
          <ChevronLeft size={15} />
        </button>
        <button
          className="btn join-item px-2 btn-soft max-md:btn-sm min-md:px-3"
          onClick={goToNextWeek}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
