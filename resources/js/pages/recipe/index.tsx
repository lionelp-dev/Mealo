import { AppMainContent } from '@/components/app-main-content';
import DeleteRecipe from '@/components/delete-recipe';
import { LanguageSwitcher } from '@/components/language-switcher';
import { RecipeCard } from '@/components/recipe-card';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { PaginatedCollection, Recipe } from '@/types';
import { Head, InfiniteScroll, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  recipes_collection: PaginatedCollection<Recipe>;
};

export default function Recipes() {
  const { t } = useTranslation();

  const { recipes_collection } = usePage<PageProps>().props;

  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  return (
    <AppLayout
      headerRightContent={
        <div className="flex items-center gap-8">
          <button
            className="btn btn-primary"
            onClick={() => router.get(recipes.create.url())}
          >
            {t('recipes.index.createButton')}
          </button>
          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={t('recipes.pageTitle')}></Head>

      <AppMainContent className="w-[92%]">
        <InfiniteScroll data="recipes_collection">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(22rem,100%),1fr)))] gap-x-6 gap-y-10">
            {recipes_collection.data.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={setRecipeToDelete}
              />
            ))}
          </div>
        </InfiniteScroll>
      </AppMainContent>
      <DeleteRecipe 
        recipe={recipeToDelete} 
        onClose={() => setRecipeToDelete(null)}
      />
    </AppLayout>
  );
}
