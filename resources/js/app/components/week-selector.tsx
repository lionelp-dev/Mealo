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
  onTodayClick: () => void;
  onPreviousWeekClick: () => void;
  onNextWeekClick: () => void;
};

export default function WeekSelector({
  currentWeek,
  leadingContent,
  className,
  onTodayClick,
  onPreviousWeekClick,
  onNextWeekClick,
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

  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-end gap-2 gap-x-5 max-lg:flex-wrap min-lg:items-center',
        className,
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-4 min-lg:order-2">
        {leadingContent}

        <span className="min-w-0 truncate text-2xl font-semibold tracking-tight text-secondary capitalize max-lg:pl-2.5">
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
          className={cn('btn btn-soft max-sm:btn-sm')}
          onClick={onTodayClick}
        >
          {t('mealPlanning.weekSelector.today', 'Today')}
        </button>
        <button
          className="btn join-item px-1.5 btn-soft max-md:btn-sm min-md:px-2.5"
          onClick={onPreviousWeekClick}
        >
          <ChevronLeft className="h-3.5 md:h-4.75" />
        </button>
        <button
          className="btn join-item px-1.5 btn-soft max-md:btn-sm min-md:px-2.5"
          onClick={onNextWeekClick}
        >
          <ChevronRight className="h-3.5 md:h-4.75" />
        </button>
      </div>
    </div>
  );
}
