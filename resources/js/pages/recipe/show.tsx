import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import type { Recipe } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  recipe: {
    data: Recipe;
  };
};

function Recipe() {
  const { t } = useTranslation();
  const { recipe } = usePage<PageProps>().props;

  return (
    <AppLayout
      headerRightContent={
        <div className="flex gap-2 self-end">
          <button
            className="btn btn-secondary"
            onClick={() =>
              router.visit(recipes.edit.url({ id: recipe.data.id }))
            }
          >
            {t('common.buttons.edit')}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.visit(recipes.index.url())}
          >
            {t('recipes.index.viewButton')}
          </button>
          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={`${recipe.data.name}`}></Head>
      <div className="overflow-y-auto">
        <div className="mx-auto flex max-w-[85%] flex-col">
          <h1 className="mb-4 text-3xl font-bold">{recipe.data.name}</h1>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <p className="text-gray-700">{recipe.data.description}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-800">
                {t('recipes.table.preparationTime')}
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {recipe.data.preparation_time} min
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-800">
                {t('recipes.table.cookingTime')}
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {recipe.data.cooking_time} min
              </p>
            </div>
          </div>

          <div className="grid gap-4 min-xl:grid-cols-2">
            {recipe.data.steps && recipe.data.steps.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {t('recipes.form.stepsTitle')}
                </h2>
                <div className="space-y-4">
                  {recipe.data.steps
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

            {recipe.data.ingredients && recipe.data.ingredients.length > 0 && (
              <div className="mb-6 overflow-x-auto">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {t('recipes.form.ingredientsTitle')}
                </h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('recipes.ingredients.nameLabel')}</th>
                      <th>{t('recipes.ingredients.quantityLabel')}</th>
                      <th>{t('recipes.ingredients.unitLabel')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.data.ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td className="font-medium">{ingredient.name}</td>
                        <td>{ingredient.quantity}</td>
                        <td>{ingredient.unit}</td>
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
