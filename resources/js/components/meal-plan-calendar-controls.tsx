import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';

import { useMealPlanNavigation } from '../hooks/use-meal-plan-navigation';
import { Button } from './ui/button';

type MealPlanProps = {
  weekStart: string;
};

export default function MealPlanCalendarControls() {
  const { weekStart } = usePage<MealPlanProps>().props;

  const currentWeek = DateTime.fromISO(weekStart);
  const endOfWeek = currentWeek.endOf('week');

  const { goToCurrentDay, goToPrevWeek, goToNextWeek } =
    useMealPlanNavigation(currentWeek);

  return (
    <div className="flex gap-10 divide-x divide-gray-300">
      <Button variant="outline" onClick={goToCurrentDay}>
        Today
      </Button>
      <div className="flex items-center gap-5 pl-5">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={goToPrevWeek}>
            <ChevronLeft />
          </Button>
          <div className="pl-1">
            Week {currentWeek.weekNumber}
          </div>
          <Button size="sm" variant="ghost" onClick={goToNextWeek}>
            <ChevronRight />
          </Button>
        </div>
        <div>
          {currentWeek.month === endOfWeek.month
            ? `${currentWeek.day} - ${endOfWeek.day} ${currentWeek.monthLong!} ${currentWeek.year}`
            : `${currentWeek.day} ${currentWeek.monthShort!} ${currentWeek.year !== endOfWeek.year ? currentWeek.year : ''} - ${endOfWeek.day} ${endOfWeek.monthLong!} ${endOfWeek.year} `}
        </div>
      </div>
    </div>
  );
}
