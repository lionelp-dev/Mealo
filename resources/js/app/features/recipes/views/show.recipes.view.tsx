import { useRecipesContextValue } from '../inertia.adapter';
import { LanguageSwitcher } from '@/app/components/language-switcher';
import { usePermissions } from '@/app/hooks/use-permissions';
import AppLayout from '@/app/layouts/app-layout';
import recipes from '@/routes/recipes';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function ShowRecipesView() {
  const { t } = useTranslation();

  const { recipe } = useRecipesContextValue();

  const { canEditRecipe } = usePermissions();

  return (
    <AppLayout
      headerRightContent={
        <div className="flex items-center gap-8">
          {canEditRecipe(recipe.user_id) && (
            <div className="flex gap-4 self-end">
              <button
                className="btn"
                onClick={() => router.get(recipes.edit.url({ id: recipe.id }))}
              >
                {t('recipes.index.editBtn', 'Modify')}
              </button>
            </div>
          )}
          <div className="flex gap-4 self-end">
            <button
              className="btn"
              onClick={() => router.visit(recipes.index.url())}
            >
              {t('recipes.index.viewButton', 'View my recipes')}
            </button>
          </div>
          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={`${recipe.name}`}></Head>

      <div className="overflow-y-auto py-8">
        <div className="mx-auto flex max-w-[85%] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-base-content">
              {recipe.name}
            </h1>

            <p className="text-base-content">{recipe.description}</p>
          </div>

          {recipe.image_url && (
            <div className="relative">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="max-h-96 w-full rounded-lg object-cover shadow-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col rounded-lg bg-base-100 px-7 py-4">
              <h3 className="font-semibold text-base-content">
                {t('recipes.show.servingSize', 'Portions')}
              </h3>
              <p className="text-2xl font-bold text-base-content">
                {recipe.serving_size}
              </p>
            </div>

            <div className="flex flex-col rounded-lg bg-base-100 px-7 py-4">
              <h3 className="font-semibold text-base-content">
                {t('recipes.table.preparationTime', 'Preparation time')}
              </h3>
              <p className="text-2xl font-bold text-base-content">
                {recipe.preparation_time} min
              </p>
            </div>

            <div className="flex flex-col rounded-lg bg-base-100 px-7 py-4">
              <h3 className="font-semibold text-base-content">
                {t('recipes.table.cookingTime', 'Cooking time')}
              </h3>
              <p className="text-2xl font-bold text-base-content">
                {recipe.cooking_time} min
              </p>
            </div>
          </div>

          <div className="grid gap-6 min-xl:grid-cols-2">
            {recipe.steps && recipe.steps.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-base-content">
                  {t('recipes.form.stepsTitle', 'Steps')}
                </h2>
                <div className="space-y-4">
                  {recipe.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <div key={step.id} className="rounded-lg bg-base-100 p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
                            {step.order}
                          </span>
                          <p className="flex-1 text-base-content">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-base-content">
                  {t('recipes.form.ingredientsTitle', 'Ingredients')}
                </h2>
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>{t('recipes.ingredients.nameLabel', 'Name')}</th>
                      <th>
                        {t('recipes.ingredients.quantityLabel', 'Quantity')}
                      </th>
                      <th>{t('recipes.ingredients.unitLabel', 'Unit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ingredient) => (
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
