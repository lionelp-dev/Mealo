import { AppMainContent } from '@/components/app-main-content';
import { LanguageSwitcher } from '@/components/language-switcher';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { PaginatedCollection, Recipe } from '@/types';
import { Head, InfiniteScroll, router, usePage } from '@inertiajs/react';
import { AlertTriangle, EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as Popover from '@radix-ui/react-popover';

type PageProps = {
  recipes_collection: PaginatedCollection<Recipe>;
};

export default function Recipes() {
  const { recipes_collection } = usePage<PageProps>().props;
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [openPopover, setOpenPopover] = useState<number | null>(null);
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

      <AppMainContent className="w-[92%]">
        <InfiniteScroll data="recipes_collection">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(22rem,100%),1fr)))] gap-x-6 gap-y-10">
            {recipes_collection.data.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() =>
                  router.visit(recipes.show.url({ id: recipe.id }))
                }
                className="card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl"
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 left-0 flex justify-end gap-2 p-4">
                    <Popover.Root
                      open={openPopover === recipe.id}
                      onOpenChange={(open) =>
                        setOpenPopover(open ? recipe.id : null)
                      }
                    >
                      <Popover.Trigger asChild>
                        <button
                          className="btn btn-circle border-base-300/75 bg-base-300/75 btn-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EllipsisVertical
                            size={14}
                            className="rotate-90 text-base-content/75"
                          />
                        </button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          className="z-[10000] rounded-lg border border-base-300 bg-base-100 p-2 shadow-xl"
                          side="top"
                          align="end"
                          sideOffset={8}
                          alignOffset={-4}
                        >
                          <ul className="flex flex-col gap-1 [&>button]:flex [&>button]:items-center [&>button]:justify-end">
                            <button
                              className="btn items-end justify-start gap-2 rounded-md text-error btn-ghost btn-sm hover:bg-error/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setOpenPopover(null);
                                setRecipeToDelete(recipe);
                              }}
                            >
                              <li>{t('common.buttons.delete')}</li>
                            </button>
                          </ul>
                          <Popover.Arrow className="fill-base-100 stroke-base-300" />
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
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
                    <figure className="flex h-42 items-center justify-center bg-base-200"></figure>
                  )}
                  <div className="absolute right-0 bottom-0 left-0 flex max-h-[1.5lh] flex-wrap justify-start gap-2 overflow-hidden px-2 py-2">
                    {recipe.meal_times.map((meal_time) => (
                      <span
                        key={meal_time.id}
                        className="badge bg-base-100/90 badge-sm whitespace-nowrap"
                      >
                        {meal_time.name}
                      </span>
                    ))}
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="badge bg-base-100/80 badge-sm whitespace-nowrap text-base-content"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-body">
                  <div className="flex flex-col gap-1">
                    <h2 className="card-title text-base-content">
                      {recipe.name}
                    </h2>

                    <p className="line-clamp-2 text-base-content/70">
                      {recipe.description}
                    </p>
                  </div>
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
