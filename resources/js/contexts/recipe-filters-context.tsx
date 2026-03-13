import { createGenericContext } from '@/hooks/use-generic-context';
import { PaginatedCollection, Recipe, Tag } from '@/types';

export interface RecipeFiltersContextProps {
  recipes: PaginatedCollection<Recipe>;
  tags: Tag[];
}

const {
  Provider: RecipeFiltersDataProvider,
  useContextValue: useRecipeFiltersContext,
} = createGenericContext<RecipeFiltersContextProps>();

export { RecipeFiltersDataProvider, useRecipeFiltersContext };
