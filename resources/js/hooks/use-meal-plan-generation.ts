import plannedMeals from '@/routes/planned-meals';
import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export function useMealPlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [startDate, setStartDate] = useState(DateTime.now().toISODate());
  const [days, setDays] = useState(4);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const startDateTime = DateTime.fromISO(startDate);
    const endOfWeek = startDateTime.endOf('week');
    const remainingDays = Math.min(
      7,
      endOfWeek.diff(startDateTime, 'days').days + 1,
    );
    setDays(Math.floor(remainingDays));
  }, [startDate]);

  const handleGeneratePlan = () => {
    setIsGenerating(true);

    router.post(
      plannedMeals.generate.url(),
      {
        startDate: startDate,
        days: days,
      },
      {
        onFinish: () => {
          setIsGenerating(false);
          setIsOpen(false);
        },
        onError: () => setIsGenerating(false),
      },
    );
  };

  return {
    isGenerating,
    startDate,
    setStartDate,
    days,
    setDays,
    handleGeneratePlan,
    isOpen,
    setIsOpen,
  };
}