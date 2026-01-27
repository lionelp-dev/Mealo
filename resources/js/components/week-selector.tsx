import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { useWeekSelector } from '@/hooks/use-week-selector';

type WeekSelectorProps = {
  currentWeek: DateTime;
  url: string;
};

export default function WeekSelector({ currentWeek, url }: WeekSelectorProps) {
  const { t } = useTranslation();
  const weekStart = currentWeek.startOf('week');
  const endOfWeek = currentWeek.endOf('week');

  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url,
  });

  return (
    <div className="flex gap-5 divide-x divide-base-300">
      <div className="flex items-center gap-9">
        <button className="btn" onClick={goToCurrentWeek}>
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
            ? `${weekStart.day} - ${endOfWeek.day} ${weekStart.monthLong!} ${weekStart.year}`
            : `${weekStart.day} ${weekStart.monthShort!} ${weekStart.year !== endOfWeek.year ? weekStart.year : ''} - ${endOfWeek.day} ${endOfWeek.monthLong!} ${endOfWeek.year} `}
        </span>
        <span className="-mb-[1px] badge rounded-full badge-soft badge-outline badge-sm pb-[0.3px] whitespace-nowrap badge-secondary">
          {t('mealPlanning.weekSelector.week', 'Week')}{' '}
          {currentWeek.weekNumber.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
