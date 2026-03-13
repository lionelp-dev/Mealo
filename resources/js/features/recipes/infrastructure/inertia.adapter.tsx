import { createGenericContext } from '@/hooks/use-generic-context';
import {
  Ingredient,
  MealTime,
  PaginatedCollection,
  Recipe,
  Tag,
} from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = {
  recipe: {
    data: Recipe;
  };
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
  meal_times: {
    data: MealTime[];
  };
  tags_search_results?: {
    data: Tag[];
  };
  ingredients_search_results?: {
    data: Ingredient[];
  };
  should_open_ai_modal: boolean;
  generated_recipe?: Omit<Recipe, 'user_id'> | null;
};

export const {
  Provider: RecipesProvider,
  useContextValue: useRecipesContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function RecipesInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);
  return <RecipesProvider data={data}>{children}</RecipesProvider>;
}
