import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import type { Recipe } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

type PageProps = {
  collection: {
    data: Recipe;
  };
};

function Recipe() {
  const { collection } = usePage<PageProps>().props;
  const { data: recipe } = collection;
  return (
    <AppLayout
      headerRightContent={
        <div className="flex gap-2 self-end">
          <button
            className="btn btn-secondary"
            onClick={() => router.visit(recipes.edit.url({ id: recipe.id }))}
          >
            Modifier la recette
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.visit(recipes.index.url())}
          >
            Voir mes recettes
          </button>
        </div>
      }
    >
      <Head title={`${recipe.name}`}></Head>
      <div className="overflow-y-auto">
        <div className="mx-auto flex max-w-[85%] flex-col">
          <h1 className="mb-4 text-3xl font-bold">{recipe.name}</h1>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="text-gray-700">{recipe.description}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">
                Preparation time
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {recipe.preparation_time} min
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">
                Cooking time
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {recipe.cooking_time} min
              </p>
            </div>
          </div>

          <div className="grid gap-4 min-xl:grid-cols-2">
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Étapes
                </h2>
                <div className="space-y-4">
                  {recipe.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <div key={step.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                            {step.order}
                          </span>
                          <p className="flex-1 text-gray-700">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mb-6 overflow-x-auto">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Ingredients
                </h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td className="font-medium">{ingredient.name}</td>
                        <td>{ingredient.pivot.quantity}</td>
                        <td>{ingredient.pivot.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Recipe;
