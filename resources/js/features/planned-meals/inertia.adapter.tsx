import { createGenericContext } from '@/shared/hooks/use-generic-context';
import {
  MealTime,
  PageProps,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
  WorkspaceData,
} from '@/types';
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type Props = PageProps & {
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
} = createGenericContext<Props & { url: string }>();

export function PlannedMealsInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<Props>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);

  usePoll(3000, {
    only: ['plannedMeals'],
  });

  return <PlannedMealsProvider data={data}>{children}</PlannedMealsProvider>;
}
