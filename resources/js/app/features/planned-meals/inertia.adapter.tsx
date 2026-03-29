import {
  MealTimeResource,
  RecipeResource,
  TagResource,
} from '@/app/data/resources/recipe/types';
import { createGenericContext } from '@/app/hooks/use-generic-context';
import { PaginatedCollection, SharedData } from '@/types';
import { PlannedMeal } from '@/types';
import { WorkspaceData } from '@/types';
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  weekStart: string;
  mealTimes: MealTimeResource[];
  plannedMeals: Array<PlannedMeal>;
  recipes: PaginatedCollection<RecipeResource>;
  workspace_data: WorkspaceData;
  tags: TagResource[];
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
