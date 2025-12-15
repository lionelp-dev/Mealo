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
    <div className="flex gap-5 divide-x divide-gray-300">
      <button className="btn btn-outline" onClick={goToCurrentWeek}>
        {t('mealPlanning.weekSelector.today')}
      </button>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <button className="btn btn-sm btn-ghost" onClick={goToPreviousWeek}>
            <ChevronLeft />
          </button>
          <button className="btn btn-sm btn-ghost" onClick={goToNextWeek}>
            <ChevronRight />
          </button>
        </div>
        <span>{t('mealPlanning.weekSelector.week')} {currentWeek.weekNumber.toString().padStart(2, '0')}</span>
        <span className="text-lg">
          {weekStart.month === endOfWeek.month
            ? `${weekStart.day} - ${endOfWeek.day} ${weekStart.monthLong!} ${weekStart.year}`
            : `${weekStart.day} ${weekStart.monthShort!} ${weekStart.year !== endOfWeek.year ? weekStart.year : ''} - ${endOfWeek.day} ${endOfWeek.monthLong!} ${endOfWeek.year} `}
        </span>
      </div>
    </div>
  );
}
