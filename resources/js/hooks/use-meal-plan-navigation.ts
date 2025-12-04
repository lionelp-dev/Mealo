import { router } from '@inertiajs/react'
import { DateTime } from 'luxon'

export const useMealPlanNavigation = (currentWeek: DateTime) => {
  const goToPrevWeek = () => {
    const prevWeek = currentWeek.minus({ week: 1 }).toISODate()
    router.visit('/planned-meals', {
      data: {
        week: prevWeek,
      },
    })
  }

  const goToNextWeek = () => {
    const nextWeek = currentWeek.plus({ week: 1 }).toISODate()
    router.visit('/planned-meals', {
      data: {
        week: nextWeek,
      },
    })
  }

  const goToCurrentDay = () => {
    const weekStart = DateTime.now().startOf('week').toISODate()
    router.visit('/planned-meals', {
      data: {
        week: weekStart,
      },
    })
  }
  return {
    goToPrevWeek,
    goToNextWeek,
    goToCurrentDay,
  }
}
