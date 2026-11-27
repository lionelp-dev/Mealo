import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { ActiveRecipeFilters } from './active-recipe-filters';
import { RecipeListItem } from './recipe-list-item';
import { RecipesMultiSelectToolbar } from './recipes-multi-select-toolbar';
import { Typography } from '@/app/components/Typography';
import { RecipesFiltersPopover } from '@/app/components/recipes-filters-popover';
import RecipesSearch from '@/app/components/recipes-search';
import { StarterRecipesNotice } from '@/app/components/starter-recipes-notice';
import {
  MealTimeResource,
  RecipeResource,
  TagResource,
} from '@/app/data/resources/recipe/types';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { useRecipesSearchStore } from '@/app/stores/use-recipes-search-store';
import { InfiniteScroll } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  recipes: RecipeResource[];
  tags: TagResource[];
  mealTimes: MealTimeResource[];
  selectedRecipeId: string | null;
  recentlyAddedRecipeId: string | null;
  isDiscovering: boolean;
  isGeneratingStarterRecipes: boolean;
  onSelectRecipe: (recipe: RecipeResource) => void;
};

export function RecipesBookPanel({
  recipes,
  tags,
  mealTimes,
  selectedRecipeId,
  recentlyAddedRecipeId,
  isDiscovering,
  isGeneratingStarterRecipes,
  onSelectRecipe,
}: Props) {
  const { t } = useTranslation();
  const searchTerm = useRecipesSearchStore((state) => state.searchTerm);
  const activeFilters = useRecipesFiltersStore((state) => state.activeFilters);
  const isMultiSelectMode = useRecipesMultiSelectStore(
    (state) => state.isMultiSelectMode,
  );
  const selectedRecipeIds = useRecipesMultiSelectStore(
    (state) => state.selectedRecipeIds,
  );
  const toggleRecipeSelection = useRecipesMultiSelectStore(
    (state) => state.toggleRecipeSelection,
  );
  const startMultiSelect = useRecipesMultiSelectStore(
    (state) => state.startMultiSelect,
  );
  const selectedRecipeIdSet = useMemo(
    () => new Set(selectedRecipeIds),
    [selectedRecipeIds],
  );
  const isUnfilteredRecipeList =
    searchTerm.trim() === '' && activeFilters.length === 0;
  const hasRecipes = recipes.length > 0;

  return (
    <div className="flex min-h-0 flex-col overflow-hidden lg:col-start-1 lg:row-start-1">
      <section
        aria-label={t('recipes.index.bookTitle', 'My recipe book')}
        className="order-2 flex h-full min-h-0 min-w-0 flex-1 flex-col border-r border-base-300/60 bg-base-100 px-3 lg:px-5 lg:pl-6"
      >
        <div className="-mx-3 mb-3 shrink-0 border-b border-base-300/60 bg-base-100 px-3 lg:-mx-5 lg:px-5">
          <div className="py-3.5">
            <Typography
              as="h2"
              variant="body-2xl"
              tone="secondary"
              className="mb-3 flex items-center gap-2"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-base-200 text-secondary">
                <Bookmark size={19} aria-hidden="true" />
              </span>
              {t('recipes.index.bookTitle', 'My recipe book')}
            </Typography>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2.5">
              <RecipesSearch className="min-w-0" />
              <RecipesFiltersPopover
                tags={tags}
                mealTimes={mealTimes}
                label={t('recipes.index.filters', 'Filters')}
                compact
                className="min-w-0"
              />
              <ActiveRecipeFilters />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <InfiniteScroll data="recipes">
            {!hasRecipes ? (
              isGeneratingStarterRecipes && isUnfilteredRecipeList ? (
                <StarterRecipesNotice />
              ) : (
                <div className="rounded-xl border border-dashed border-base-300 px-5 py-10 text-center text-sm text-base-content/60">
                  {t('recipes.index.empty', 'No recipes yet.')}
                </div>
              )
            ) : (
              <div className="divide-y divide-base-200">
                {recipes.map((recipe) => (
                  <RecipeListItem
                    key={recipe.id}
                    recipe={recipe}
                    isSelected={selectedRecipeId === recipe.id}
                    isRecentlyAdded={recentlyAddedRecipeId === recipe.id}
                    isMultiSelectMode={isMultiSelectMode}
                    isChecked={selectedRecipeIdSet.has(recipe.id)}
                    onActivate={() => onSelectRecipe(recipe)}
                    onToggleSelection={() => toggleRecipeSelection(recipe.id)}
                    onStartMultiSelect={() => startMultiSelect(recipe.id)}
                  />
                ))}
              </div>
            )}
            {hasRecipes && isGeneratingStarterRecipes && (
              <StarterRecipesNotice variant="inline" />
            )}
          </InfiniteScroll>
        </div>

        {!isDiscovering && isMultiSelectMode && (
          <footer className="-mx-3 shrink-0 border-t border-base-300/60 bg-base-100 lg:-mx-5">
            <RecipesMultiSelectToolbar />
          </footer>
        )}
      </section>
    </div>
  );
}
