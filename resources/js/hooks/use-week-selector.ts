import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';

type UseWeekSelectorProps = {
  currentWeek: DateTime;
  url: string;
};

export const useWeekSelector = ({ currentWeek, url }: UseWeekSelectorProps) => {
  const scrollToToday = () =>
    requestAnimationFrame(() => {
      const todayContainer = document.getElementById('today');
      if (todayContainer) {
        todayContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });

  const navigateToWeek = (targetWeek: DateTime) => {
    router.get(
      url,
      {
        week: targetWeek.toISODate(),
      },
      { preserveState: true, onSuccess: () => scrollToToday() },
    );
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
