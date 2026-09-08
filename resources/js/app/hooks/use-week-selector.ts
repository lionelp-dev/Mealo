import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';

type UseWeekSelectorProps = {
  currentWeek: DateTime;
  url: string;
};

type NavigateToWeekOptions = {
  onSuccess?: () => void;
};

export const useWeekSelector = ({ currentWeek, url }: UseWeekSelectorProps) => {
  const goToWeek = (
    targetWeek: DateTime,
    options: NavigateToWeekOptions = {},
  ) => {
    router.get(
      url,
      {
        week: targetWeek.toISODate(),
      },
      { preserveState: true, onSuccess: options.onSuccess },
    );
  };

  const goToPreviousWeek = () => {
    goToWeek(currentWeek.minus({ weeks: 1 }));
  };

  const goToNextWeek = () => {
    goToWeek(currentWeek.plus({ weeks: 1 }));
  };

  const goToCurrentWeek = (options?: NavigateToWeekOptions) => {
    goToWeek(DateTime.now(), options);
  };

  return {
    goToWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
};
