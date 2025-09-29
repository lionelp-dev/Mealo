import { RecipeForm } from '@/components/recipe-form';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { MealTime, Recipe } from '@/types';
import { Head, router } from '@inertiajs/react';

interface EditRecipeProps {
  collection: {
    data: Recipe;
  };
  meal_times: {
    data: MealTime[];
  };
}

function EditRecipe({ collection }: EditRecipeProps) {
  const { data: recipe } = collection;

  const defaultValues = {
    name: recipe.name,
    description: recipe.description,
    preparation_time: recipe.preparation_time,
    cooking_time: recipe.cooking_time,
    ingredients:
      recipe.ingredients?.map((ing) => ({
        name: ing.name,
        quantity: Number(ing.pivot.quantity),
        unit: ing.pivot.unit,
      })) || [],
    steps:
      recipe.steps?.map((step) => ({
        description: step.description,
        order: step.order,
      })) || [],
    tags:
      recipe.tags?.map((tag) => ({
        name: tag.name,
      })) || [],
    meal_times:
      recipe.meal_times?.map((meal_time) => ({
        name: meal_time.name,
      })) || [],
  };

  return (
    <AppLayout
      headerRightContent={
        <button
          className="btn w-fit self-end btn-primary"
          onClick={() => router.visit(recipes.show.url({ id: recipe.id }))}
        >
          Retour à la recette
        </button>
      }
    >
      <Head title={`Modifier ${recipe.name}`}></Head>
      <div className="h-screen overflow-y-auto">
        <div className="mx-auto flex max-w-[85%] flex-col gap-3">
          <h1 className="mb-6 text-2xl font-bold">Modifier la recette</h1>
          <RecipeForm
            defaultValues={defaultValues}
            mode="edit"
            onSubmit={({ value }) => {
              router.put(recipes.update.url(recipe.id), value);
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default EditRecipe;
