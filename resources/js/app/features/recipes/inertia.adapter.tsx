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
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useMemo } from 'react';

type PageProps = SharedData &
  Partial<{
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
    show_recipe_ai_generation_modal: boolean;
    generated_recipe?: GeneratedRecipeResource;
    generated_image_data_url?: string | null;
  }>;

export const {
  Provider: RecipesProvider,
  useContextValue: useRecipesContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function RecipesInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);

  // While a new user's starter pack is generating, poll so freshly created
  // recipes (and the generating flag) appear without a manual refresh.
  const generating = !!pageProps.starterRecipes?.generating;
  const { start, stop } = usePoll(
    3000,
    { only: ['recipes', 'starterRecipes'] },
    { autoStart: false },
  );
  useEffect(() => {
    if (generating) start();
    else stop();
  }, [generating, start, stop]);

  return <RecipesProvider data={data}>{children}</RecipesProvider>;
}
