import { LanguageSwitcher } from '@/components/language-switcher';
import MealPlanCalendar from '@/components/meal-plan-calendar';
import { MealPlanGenerationPopover } from '@/components/meal-plan-generation-popover';
import WeekSelector from '@/components/week-selector';
import { MealPlanDataProvider } from '@/contexts/meal-plan-data-context';
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
    <MealPlanDataProvider
      data={{ weekStart, mealTimes, plannedMeals, recipes, tags }}
    >
      <AppLayout
        headerLeftContent={
          <WeekSelector
            currentWeek={DateTime.fromISO(weekStart)}
            url={plannedMealsRoute.index.url()}
          />
        }
        headerRightContent={
          <div className="flex items-center gap-4">
            <MealPlanGenerationPopover />
            <LanguageSwitcher />
          </div>
        }
      >
        <div className="overflow-y-scroll px-7 py-7">
          <Head title={t('mealPlanning.pageTitle', 'Meal Planning')}></Head>
          <MealPlanCalendar />
        </div>
      </AppLayout>
    </MealPlanDataProvider>
  );
}
