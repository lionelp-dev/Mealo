import { useMealPlanClipboardStore } from '@/stores/meal-plan-clipboard';
import { DayPlannedMeals } from '@/types';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMealPlanActions } from './use-meal-plan-actions';

export const useMealPlanDayActions = (dayPlannedMeals: DayPlannedMeals) => {
  const { i18n } = useTranslation();

  const [date, setDate] = useState<DateTime>(
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

  const { copiedDayPlannedMeals, setCopiedDayPlannedMeals } =
    useMealPlanClipboardStore();

  const { planMeals, unplanMeals } = useMealPlanActions();

  const handleCopy = () => {
    setCopiedDayPlannedMeals(dayPlannedMeals);
    closeMenu();
  };

  const handlePaste = () => {
    const date = dayPlannedMeals.date.toISODate();

    if (!copiedDayPlannedMeals || !date) return;

    planMeals({
      meals: copiedDayPlannedMeals.plannedMealsSlots.flatMap((mealSlot) =>
        mealSlot.plannedMeals.map((meal) => ({
          meal_time_id: mealSlot.mealTime.id,
          recipe_id: meal.recipe.id,
          planned_date: date,
        })),
      ),
    });

    setCopiedDayPlannedMeals(null);
    closeMenu();
  };

  const handleDeleteAll = () => {
    unplanMeals(
      dayPlannedMeals.plannedMealsSlots.flatMap((mealSlot) =>
        mealSlot.plannedMeals.map((plannedMeal) => plannedMeal.id),
      ),
    );
    closeMenu();
  };

  return {
    isOpen,
    setIsOpen,
    closeMenu,
    toggleMenu,
    date,
    isCurrentDay,
    hasPlannedMeals,
    copiedDayPlannedMeals,
    handleCopy,
    handlePaste,
    handleDeleteAll,
  };
};
