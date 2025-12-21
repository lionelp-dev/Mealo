import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { Ingredient, MealTime, Recipe, Tag } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { RecipeForm } from './recipe-form';

type PageProps = {
  recipe: {
    data: Recipe;
  };
  meal_times: {
    data: MealTime[];
  };
  tags_search_results?: {
    data: Tag[];
  };
  ingredients_search_results?: {
    data: Ingredient[];
  };
};

function EditRecipe() {
  const { t } = useTranslation();
  const {
    recipe,
    meal_times,
    tags_search_results,
    ingredients_search_results,
  } = usePage<PageProps>().props;

  return (
    <AppLayout
      headerRightContent={
        <div className="flex items-center gap-8">
          8
          <button
            className="btn w-fit self-end btn-primary"
            onClick={() =>
              router.visit(recipes.show.url({ id: recipe.data.id }))
            }
          >
            {t('common.buttons.back')}
          </button>
          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={t('recipes.edit.pageTitle')}></Head>
      <div className="h-screen overflow-y-auto">
        <div className="mx-auto flex max-w-[85%] flex-col gap-3">
          <h1 className="mb-6 text-2xl font-bold">{t('recipes.edit.title')}</h1>
          <RecipeForm
            defaultValues={recipe.data}
            mode="edit"
            onSubmit={({ value }) => {
              router.put(recipes.update.url(recipe.data.id), value);
            }}
            meal_times={meal_times}
            tags_search_results={tags_search_results}
            ingredients_search_results={ingredients_search_results}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default EditRecipe;
