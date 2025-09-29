import { RecipeForm } from '@/components/recipe-form';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { RecipeFormInput } from '@/types';
import { Head, router } from '@inertiajs/react';

function CreateRecipe() {
  const defaultValues: RecipeFormInput = {
    name: '',
    description: '',
    preparation_time: 0,
    cooking_time: 0,
    ingredients: [],
    steps: [],
    tags: [],
    meal_times: [],
  };
  return (
    <AppLayout
      headerRightContent={
        <button
          className="btn w-fit btn-primary"
          onClick={() => router.get(recipes.index.url())}
        >
          Voir mes recettes
        </button>
      }
    >
      <Head title="Create Recipe"></Head>
      <div className="flex flex-col overflow-y-auto py-5">
        <div className="mx-auto w-[85%]">
          <h1 className="mb-6 text-2xl font-bold">
            Créer une nouvelle recette
          </h1>

          <RecipeForm
            defaultValues={defaultValues}
            mode="create"
            onSubmit={({ value }) => {
              router.post(recipes.store.url(), value);
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default CreateRecipe;
