import { RecipeForm } from '@/components/recipe-form';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { MealTime, Recipe } from '@/types';
import { Head, router } from '@inertiajs/react';

interface EditRecipeProps {
  recipe: {
    data: Recipe;
  };
  meal_times: {
    data: MealTime[];
  };
}

function EditRecipe({ recipe }: EditRecipeProps) {
  const defaultValues = {
    name: recipe.data.name,
    description: recipe.data.description,
    preparation_time: recipe.data.preparation_time,
    cooking_time: recipe.data.cooking_time,
    ingredients:
      recipe.data.ingredients?.map((ing) => ({
        name: ing.name,
        quantity: Number(ing.pivot.quantity),
        unit: ing.pivot.unit,
      })) || [],
    steps:
      recipe.data.steps?.map((step) => ({
        description: step.description,
        order: step.order,
      })) || [],
    tags:
      recipe.data.tags?.map((tag) => ({
        name: tag.name,
      })) || [],
    meal_times:
      recipe.data.meal_times?.map((meal_time) => ({
        name: meal_time.name,
      })) || [],
  };

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
            defaultValues={defaultValues}
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
