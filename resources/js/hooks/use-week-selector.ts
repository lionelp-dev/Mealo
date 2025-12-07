import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';

type UseWeekSelectorProps = {
  currentWeek: DateTime;
  url: string;
};

export const useWeekSelector = ({ currentWeek, url }: UseWeekSelectorProps) => {
  const navigateToWeek = (targetWeek: DateTime) => {
    router.get(url, {
      week: targetWeek.toISODate(),
    });
  };

  const goToPreviousWeek = () => {
    navigateToWeek(currentWeek.minus({ weeks: 1 }));
  };

  const goToNextWeek = () => {
    navigateToWeek(currentWeek.plus({ weeks: 1 }));
  };

  const goToCurrentWeek = () => {
    navigateToWeek(DateTime.now());
  };

  return {
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
};
