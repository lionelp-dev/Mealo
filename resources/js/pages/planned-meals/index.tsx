import MealPlanCalendar from '@/components/meal-plan-calendar';
import WeekSelector from '@/components/week-selector';
import AppLayout from '@/layouts/app-layout';
import plannedMeals from '@/routes/planned-meals';
import { Head, usePage } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';

type PageProps = {
  weekStart: string;
};

export default function PlannedMeals() {
  const { t } = useTranslation();
  const { weekStart } = usePage<PageProps>().props;

  return (
    <AppLayout
      headerLeftContent={
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={plannedMeals.index.url()}
        />
      }
      headerRightContent={<LanguageSwitcher />}
    >
      <div className="overflow-y-scroll px-6">
        <Head title={t('mealPlanning.pageTitle')}></Head>
        <MealPlanCalendar />
      </div>
    </AppLayout>
  );
}
