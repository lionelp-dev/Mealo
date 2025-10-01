import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { MealTime, Recipe } from '@/types';
import { Head, router } from '@inertiajs/react';
import { RecipeForm } from './recipe-form';

interface EditRecipeProps {
  recipe: {
    data: Recipe;
  };
  meal_times: {
    data: MealTime[];
  };
}

function EditRecipe({ recipe }: EditRecipeProps) {
  return (
    <AppLayout
      headerRightContent={
        <button
          className="btn w-fit self-end btn-primary"
          onClick={() => router.visit(recipes.show.url({ id: recipe.data.id }))}
        >
          Retour à la recette
        </button>
      }
    >
      <Head title={`Modifier ${recipe.data.name}`}></Head>
      <div className="h-screen overflow-y-auto">
        <div className="mx-auto flex max-w-[85%] flex-col gap-3">
          <h1 className="mb-6 text-2xl font-bold">Modifier la recette</h1>
          <RecipeForm
            defaultValues={recipe.data}
            mode="edit"
            onSubmit={({ value }) => {
              router.put(recipes.update.url(recipe.data.id), value);
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default EditRecipe;
