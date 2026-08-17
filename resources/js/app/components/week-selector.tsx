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
    <div className="order-3 flex w-full flex-1 items-center gap-2 px-1 min-md:order-1">
      <span className="font-medium whitespace-nowrap text-base-content capitalize">
        {weekStart.month === endOfWeek.month
          ? `${weekStart.toLocaleString({ month: 'long', year: 'numeric' })}`
          : `${weekStart.toLocaleString({ month: 'long' })} ${weekStart.year !== endOfWeek.year ? weekStart.year : ''} - ${weekStart.toLocaleString({ month: 'long', year: 'numeric' })} `}
      </span>
      <span className="mx-3 -mb-[1px] badge rounded-full badge-soft badge-outline border-secondary/40 badge-sm py-[10.5px] whitespace-nowrap badge-secondary">
        {t('mealPlanning.weekSelector.week', 'Week')}{' '}
        {currentWeek.weekNumber.toString().padStart(2, '0')}
      </span>
      <span className="grow min-sm:hidden"></span>
      <button
        className="btn border border-secondary/40 btn-outline btn-soft btn-secondary max-sm:btn-sm min-sm:-order-2"
        onClick={goToCurrentWeek}
      >
        {t('mealPlanning.weekSelector.today', 'Today')}
      </button>
      <div className="flex items-center gap-2 justify-self-end min-sm:-order-1">
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
    </div>
  );
}
