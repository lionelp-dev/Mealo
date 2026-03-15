import { PaginatedCollection, SharedData } from '@/app/entities/';
import { MealTime } from '@/app/entities/meal-time/types';
import { PlannedMeal } from '@/app/entities/planned-meal/types';
import { Recipe, Tag } from '@/app/entities/recipe/types';
import { WorkspaceData } from '@/app/entities/workspace/types';
import { createGenericContext } from '@/app/hooks/use-generic-context';
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  weekStart: string;
  mealTimes: Array<MealTime>;
  plannedMeals: Array<PlannedMeal>;
  recipes: PaginatedCollection<Recipe>;
  workspace_data: WorkspaceData;
  tags: Tag[];
};

export const {
  Provider: PlannedMealsProvider,
  useContextValue: usePlannedMealsContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function PlannedMealsInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);

  usePoll(3000, {
    only: ['plannedMeals'],
  });

  return <PlannedMealsProvider data={data}>{children}</PlannedMealsProvider>;
}
