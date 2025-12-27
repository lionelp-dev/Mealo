import { AppMainContent } from '@/components/app-main-content';
import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { PaginatedCollection, Recipe } from '@/types';
import { Head, InfiniteScroll, router, usePage } from '@inertiajs/react';
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

      <AppMainContent>
        <InfiniteScroll data="recipes_collection">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(22rem,1fr)))] gap-x-7 gap-y-10">
            {recipes_collection.data.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() =>
                  router.visit(recipes.show.url({ id: recipe.id }))
                }
                className="card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl"
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 left-0 flex justify-end gap-2 p-5">
                    <button
                      className="btn-default btn btn-circle btn-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.get(recipes.edit.url({ id: recipe.id }));
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-default btn btn-circle btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setRecipeToDelete(recipe);
                      }}
                    >
                      <Trash2 size={16} className="text-error" />
                    </button>
                  </div>
                  {recipe.image_url ? (
                    <figure className="h-42">
                      <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  ) : (
                    <figure className="flex h-42 items-center justify-center bg-base-200">
                      <div className="text-base-content/40">
                        <svg
                          className="h-16 w-16"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </figure>
                  )}
                </div>
                <div className="card-body">
                  <h2 className="card-title text-base-content">
                    {recipe.name}
                  </h2>
                  <p className="line-clamp-2 text-base-content/70">
                    {recipe.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </AppMainContent>
      {recipeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setRecipeToDelete(null)}
        >
          <div
            role="alert"
            className="flex max-w-md flex-col items-center gap-6 rounded-md border border-base-300 bg-base-100 px-6 py-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex flex-col gap-4">
              <AlertTriangle className="text-error" />
              <span className="flex flex-col justify-center gap-1">
                <span className="text-center font-medium text-base-content">
                  {t('recipes.delete.confirmTitle')}{' '}
                </span>
                <span className="text-base-content">
                  "{recipeToDelete.name}"
                </span>
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
                className="btn btn-sm btn-error"
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
