import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { Ingredient, MealTime, Recipe, Tag } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { RecipeForm } from './recipe-form';

type PageProps = {
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

const defaultValues: Omit<Recipe, 'id'> = {
  name: '',
  description: '',
  preparation_time: 0,
  cooking_time: 0,
  ingredients: [],
  steps: [],
  tags: [],
  meal_times: [],
};

function CreateRecipe() {
  const { t } = useTranslation();
  const { meal_times, tags_search_results, ingredients_search_results } =
    usePage<PageProps>().props;
  return (
    <AppLayout
      headerRightContent={
        <div className="flex items-center gap-8">
          <button
            className="btn btn-primary"
            onClick={() => router.get(recipes.index.url())}
          >
            {t('recipes.index.viewButton')}
          </button>
          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={t('recipes.create.pageTitle')}></Head>
      <div className="flex flex-col overflow-y-auto py-5">
        <div className="mx-auto w-[85%]">
          <h1 className="mb-6 text-2xl font-bold">
            {t('recipes.create.title')}
          </h1>

          <RecipeForm
            defaultValues={defaultValues}
            mode="create"
            onSubmit={({ value }) => {
              router.post(recipes.store.url(), value);
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

export default CreateRecipe;
