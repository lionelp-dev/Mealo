import { GeneratedRecipeResource } from '@/app/data/requests/recipe/types';
import {
  IngredientResource,
  MealTimeResource,
  RecipeResource,
  TagResource,
} from '@/app/data/resources/recipe/types';
import { createGenericContext } from '@/app/hooks/use-generic-context';
import { SharedData } from '@/types';
import { PaginatedCollection } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  recipe: RecipeResource;
  recipes: PaginatedCollection<RecipeResource>;
  tags: TagResource[];
  meal_times: MealTimeResource[];
  tags_search_results?: {
    data: TagResource[];
  };
  ingredients_search_results?: {
    data: IngredientResource[];
  };
  show_generate_recipe_with_ai_modal: boolean;
  generated_recipe?: GeneratedRecipeResource;
  generated_image_data_url?: string | null;
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
