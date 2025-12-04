import { DayPlannedMeals } from '@/stores/week-meal-planner';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';

export const useDayHeaderState = (dayPlannedMeals: DayPlannedMeals) => {
  const today = DateTime.now();
  const isCurrentDay = useMemo(
    () => dayPlannedMeals.date.hasSame(today, 'day'),
    [dayPlannedMeals.date, today],
  );

  const hasPlannedMeals = useMemo(
    () =>
      (dayPlannedMeals.plannedMealsSlots &&
        dayPlannedMeals.plannedMealsSlots.length > 0) ||
      false,
    [dayPlannedMeals.plannedMealsSlots],
  );

  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isCurrentDay,
    hasPlannedMeals,
    isOpen,
    setIsOpen,
    closeMenu,
    toggleMenu,
  };
};
