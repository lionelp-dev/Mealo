import { LanguageSwitcher } from '@/components/language-switcher';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { PaginatedCollection, Recipe } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  recipes_collection: PaginatedCollection<Recipe>;
};

export default function Recipes() {
  const { recipes_collection } = usePage<PageProps>().props;
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const { t } = useTranslation();

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
      <div className="flex h-screen flex-1 flex-col overflow-y-scroll">
        <table className="table-pin-rows table mx-auto max-w-[85%]">
          <thead className="bg-white">
            <tr className="mb-1">
              <th>{t('recipes.table.name')}</th>
              <th>{t('recipes.table.description')}</th>
              <th>{t('recipes.table.preparationTime')}</th>
              <th>{t('recipes.table.cookingTime')}</th>
              <th>{t('recipes.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {recipes_collection.data.map((recipe) => (
              <tr
                key={recipe.id}
                onClick={() =>
                  router.visit(recipes.show.url({ id: recipe.id }))
                }
                className="cursor-pointer hover:bg-gray-100"
              >
                <td>{recipe.name}</td>
                <td>{recipe.description}</td>
                <td>{recipe.preparation_time}</td>
                <td>{recipe.cooking_time}</td>
                <td>
                  <div className="flex content-center">
                    <button
                      className="btn btn-ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.get(recipes.edit.url({ id: recipe.id }));
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRecipeToDelete(recipe);
                      }}
                    >
                      <Trash2 size={18} className="text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={recipes_collection.meta} />

      {recipeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setRecipeToDelete(null)}
        >
          <div
            role="alert"
            className="flex max-w-md flex-col items-center gap-6 rounded-md bg-white px-6 py-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex flex-col gap-4">
              <AlertTriangle className="text-red-600" />
              <span className="flex flex-col justify-center gap-1">
                <span className="text-center font-medium">
                  {t('recipes.delete.confirmTitle')}{' '}
                </span>
                <span>"{recipeToDelete.name}"</span>
              </span>
            </span>
            <div className="flex w-full justify-between gap-2 self-end">
              <button
                className="btn btn-sm"
                onClick={() => setRecipeToDelete(null)}
              >
                {t('recipes.delete.cancelButton')}
              </button>
              <button
                className="btn text-white btn-sm btn-error"
                onClick={() => {
                  if (recipeToDelete) {
                    router.delete(
                      recipes.destroy.url({ id: recipeToDelete.id }),
                    );
                    setRecipeToDelete(null);
                  }
                }}
              >
                {t('recipes.delete.confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
