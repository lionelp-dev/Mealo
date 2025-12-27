import { LanguageSwitcher } from '@/components/language-switcher';
import MealPlanCalendar from '@/components/meal-plan-calendar';
import WeekSelector from '@/components/week-selector';
import { MealPlanProvider } from '@/contexts/meal-plan-context';
import AppLayout from '@/layouts/app-layout';
import plannedMealsRoute from '@/routes/planned-meals';
import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type PageProps = {
  weekStart: string;
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
};

export default function PlannedMeals() {
  const { t } = useTranslation();
  const { weekStart, mealTimes, plannedMeals, recipes, tags } =
    usePage<PageProps>().props;

  return (
    <AppLayout
      headerLeftContent={
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={plannedMealsRoute.index.url()}
        />
      }
      headerRightContent={<LanguageSwitcher />}
    >
      <div className="overflow-y-scroll px-7 py-7">
        <Head title={t('mealPlanning.pageTitle')}></Head>
        <MealPlanProvider
          data={{ weekStart, mealTimes, plannedMeals, recipes, tags }}
        >
          <MealPlanCalendar />
        </MealPlanProvider>
      </div>
    </AppLayout>
  );
}
