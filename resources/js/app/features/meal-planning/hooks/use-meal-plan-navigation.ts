import { useWeekSelector } from '@/app/hooks/use-week-selector';
import mealPlanningRoute from '@/routes/meal-planning';
import { DateTime } from 'luxon';
import { useCallback } from 'react';

type UseMealPlanNavigationProps = {
  scrollToDay: (dayId: string) => void;
  weekStart: string;
};

export const useMealPlanNavigation = ({
  scrollToDay,
  weekStart,
}: UseMealPlanNavigationProps) => {
  const currentWeek = DateTime.fromISO(weekStart);

  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url: mealPlanningRoute.index.url(),
  });

  const scrollToToday = useCallback(() => {
    window.requestAnimationFrame(() => {
      const todayId = DateTime.now().toISODate();

      if (!todayId) return;

      scrollToDay(todayId);
    });
  }, [scrollToDay]);

  const goToToday = useCallback(() => {
    const today = DateTime.now();

    if (currentWeek.startOf('week').hasSame(today.startOf('week'), 'day')) {
      scrollToToday();
      return;
    }

    goToCurrentWeek({ onSuccess: scrollToToday });
  }, [currentWeek, goToCurrentWeek, scrollToToday]);

  return {
    currentWeek,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
  };
};
