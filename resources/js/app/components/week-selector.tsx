import { useWeekSelector } from '@/app/hooks/use-week-selector';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type WeekSelectorProps = {
  currentWeek: DateTime;
  leadingContent?: ReactNode;
  url: string;
};

export default function WeekSelector({
  currentWeek,
  leadingContent,
  url,
}: WeekSelectorProps) {
  const { t, i18n } = useTranslation();

  const weekStart = currentWeek.startOf('week').setLocale(i18n.language);
  const endOfWeek = currentWeek.endOf('week').setLocale(i18n.language);
  const mobileLabel = weekStart.toLocaleString({
    month: 'long',
    year: 'numeric',
  });
  const desktopLabel =
    weekStart.month === endOfWeek.month
      ? mobileLabel
      : `${weekStart.toLocaleString({ month: 'long' })} ${weekStart.year !== endOfWeek.year ? weekStart.year : ''} - ${endOfWeek.toLocaleString({ month: 'long', year: 'numeric' })}`;

  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url,
  });

  return (
    <div className="flex w-full min-w-0 items-end gap-2 gap-x-3.5 max-lg:flex-wrap min-lg:items-center">
      <div className="flex w-full min-w-0 items-center gap-2 min-lg:order-2">
        {leadingContent}
        <span className="min-w-0 text-2xl font-semibold whitespace-nowrap text-base-content capitalize max-lg:pl-2.5">
          <span className="truncate lg:hidden">{mobileLabel}</span>
          <span className="truncate max-lg:hidden">{desktopLabel}</span>
        </span>
        <span className="badge self-center rounded-full badge-soft badge-outline border-secondary/40 badge-sm py-[10.5px] whitespace-nowrap badge-secondary max-md:hidden min-lg:order-2">
          {t('mealPlanning.weekSelector.week', 'Week')}{' '}
          {currentWeek.weekNumber.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex gap-2 min-lg:order-1">
        <div className="join flex items-center min-lg:order-2">
          <button
            className="btn join-item px-2.5 text-base-content max-md:btn-sm min-md:px-3 min-lg:btn-ghost"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className="btn join-item px-2.5 text-base-content max-lg:border-l max-lg:border-l-base-300 max-md:btn-sm min-md:px-3 min-lg:btn-ghost"
            onClick={goToNextWeek}
          >
            <ChevronRight size={15} />
          </button>
        </div>
        <button
          className="btn border border-secondary/40 btn-outline btn-soft btn-secondary max-sm:btn-sm"
          onClick={goToCurrentWeek}
        >
          {t('mealPlanning.weekSelector.today', 'Today')}
        </button>
      </div>
    </div>
  );
}
