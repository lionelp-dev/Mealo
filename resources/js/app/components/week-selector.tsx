import { useWeekSelector } from '@/app/hooks/use-week-selector';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type WeekSelectorProps = {
  currentWeek: DateTime;
  url: string;
};

export default function WeekSelector({ currentWeek, url }: WeekSelectorProps) {
  const { t, i18n } = useTranslation();

  const weekStart = currentWeek.startOf('week').setLocale(i18n.language);
  const endOfWeek = currentWeek.endOf('week');

  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url,
  });

  return (
    <div className="flex gap-5 divide-x divide-base-300">
      <div className="flex items-center gap-9">
        <button
          className="btn border border-secondary/40 px-5 btn-outline btn-soft btn-secondary"
          onClick={goToCurrentWeek}
        >
          {t('mealPlanning.weekSelector.today', 'Today')}
        </button>
        <div className="-ml-4 flex items-center gap-2">
          <button
            className="btn px-1 text-base-content btn-ghost btn-sm"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft />
          </button>
          <button
            className="btn px-1 text-base-content btn-ghost btn-sm"
            onClick={goToNextWeek}
          >
            <ChevronRight />
          </button>
        </div>
        <span className="-ml-2 whitespace-nowrap text-base-content">
          {weekStart.month === endOfWeek.month
            ? `${weekStart.day}-${endOfWeek.day} ${weekStart.toLocaleString({ month: 'long', year: 'numeric' })}`
            : `${weekStart.toLocaleString({ day: 'numeric', month: 'long' })} ${weekStart.year !== endOfWeek.year ? weekStart.year : ''} - ${weekStart.toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' })} `}
        </span>
        <span className="-mb-[1px] badge rounded-full badge-soft badge-outline border-secondary/40 badge-sm py-[10.5px] whitespace-nowrap badge-secondary">
          {t('mealPlanning.weekSelector.week', 'Week')}{' '}
          {currentWeek.weekNumber.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
