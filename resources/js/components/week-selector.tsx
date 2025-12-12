import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
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
      <Button variant="outline" onClick={goToCurrentWeek}>
        {t('mealPlanning.weekSelector.today')}
      </Button>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={goToPreviousWeek}>
            <ChevronLeft />
          </Button>
          <Button size="sm" variant="ghost" onClick={goToNextWeek}>
            <ChevronRight />
          </Button>
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
