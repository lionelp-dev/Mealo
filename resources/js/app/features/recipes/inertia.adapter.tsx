import { SharedData } from '@/app/entities';
import { PaginatedCollection } from '@/app/entities/';
import { MealTime } from '@/app/entities/meal-time/types';
import { Ingredient, Recipe, Tag } from '@/app/entities/recipe/types';
import { createGenericContext } from '@/app/hooks/use-generic-context';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  recipe: {
    data: Recipe;
  };
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
  meal_times: MealTime[];
  tags_search_results?: {
    data: Tag[];
  };
  ingredients_search_results?: {
    data: Ingredient[];
  };
  show_generate_recipe_with_ai_modal: boolean;
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
