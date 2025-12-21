import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPlannedMeals } from '../stores/week-meal-planner';

export const useDayHeaderState = (dayPlannedMeals: DayPlannedMeals) => {
  const { i18n } = useTranslation();

  const [date, setDate] = useState(
    dayPlannedMeals.date.setLocale(i18n.language),
  );

  useEffect(() => {
    setDate(dayPlannedMeals.date.setLocale(i18n.language));
  }, [i18n.language]);

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
    date,
    isCurrentDay,
    hasPlannedMeals,
    isOpen,
    setIsOpen,
    closeMenu,
    toggleMenu,
  };
};
