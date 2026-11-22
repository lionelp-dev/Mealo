import { Typography } from '@/app/components/Typography';
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

        <span className="flex min-w-0 items-center truncate text-2xl font-semibold tracking-tight text-secondary capitalize max-lg:pl-2.5">
          <Typography
            as="span"
            variant="body-sm"
            className="truncate lg:hidden"
          >
            {mobileLabel}
          </Typography>
          <Typography
            as="span"
            variant="body-xl"
            tone="secondary"
            className="truncate max-lg:hidden"
          >
            {desktopLabel}
          </Typography>
        </span>

        <Typography
          as="span"
          variant="body-xs"
          tone="secondary"
          className="badge self-center rounded-full badge-soft badge-outline border-secondary/40 whitespace-nowrap badge-secondary max-md:hidden"
        >
          {t('mealPlanning.weekSelector.week', 'Week')}{' '}
          {currentWeek.weekNumber.toString().padStart(2, '0')}
        </Typography>
      </div>

      <div className={cn('flex gap-1.5', 'min-lg:order-1 min-lg:gap-2.75')}>
        <button
          className={cn('btn btn-soft max-sm:btn-sm')}
          onClick={onTodayClick}
        >
          <Typography tone="secondary">
            {t('mealPlanning.weekSelector.today', 'Today')}
          </Typography>
        </button>
        <button
          className="btn join-item px-1.5 btn-soft max-md:btn-sm min-md:px-2.5"
          onClick={onPreviousWeekClick}
        >
          <Typography tone="secondary">
            <ChevronLeft className="h-3.5 md:h-4.75" />
          </Typography>
        </button>
        <button
          className="btn join-item px-1.5 btn-soft max-md:btn-sm min-md:px-2.5"
          onClick={onNextWeekClick}
        >
          <Typography tone="secondary">
            <ChevronRight className="h-3.5 md:h-4.75" />
          </Typography>
        </button>
      </div>
    </div>
  );
}
