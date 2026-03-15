import { ShoppingListByIngredients } from '../components/shopping-list-by-ingredients';
import ShoppingListByRecipes from '../components/shopping-list-by-recipes';
import ShoppingListProgress from '../components/shopping-list-progress';
import { useShoppingList } from '../hooks/use-shopping-list';
import { useShoppingListsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import WeekSelector from '@/app/components/week-selector';
import AppLayout from '@/app/layouts/app-layout';
import { cn } from '@/app/lib/';
import shoppingLists from '@/routes/shopping-lists';
import { Head, usePrefetch } from '@inertiajs/react';
import { BookCopy, Rows2, ShoppingBasket } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export default function ShoppingListsView() {
  const { t } = useTranslation();
  const { flush } = usePrefetch();
  flush();

  const { weekStart, workspace_data } = useShoppingListsContextValue();

  const { total, setViewMode, viewMode, checkedCount } = useShoppingList();

  return (
    <AppLayout
      headerLeftContent={
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={shoppingLists.index.url()}
        />
      }
      headerRightContent={
        <div className="flex items-center gap-4">
          <NavWorkspaceSwitcher workspace_data={workspace_data} />
        </div>
      }
    >
      <Head title={t('shoppingLists.pageTitle', 'Shopping Lists')} />
      <div className="flex h-full flex-col overflow-y-hidden">
        {total > 0 && (
          <div className="mx-auto flex w-[96.5%] flex-1 flex-col gap-4 overflow-y-auto py-4">
            <div className="tabs-boxed tabs h-8 w-fit shrink-0 rounded-md bg-secondary/15 tabs-xs">
              <button
                className={cn(
                  '-pl-[15px] tab h-8 rounded-md px-4',
                  viewMode === 'ingredients' &&
                    'tab-active bg-secondary text-secondary-content btn-soft hover:text-white',
                )}
                onClick={() => setViewMode('ingredients')}
              >
                <Rows2 className="mr-2 h-4 w-4" />
                {t('shoppingLists.viewByIngredients', 'Par ingrédients')}
              </button>
              <button
                className={cn(
                  '-pr-[15px] tab h-8 rounded-md px-4 text-secondary',
                  viewMode === 'recipes' &&
                    'tab-active bg-secondary text-secondary-content hover:text-white',
                )}
                onClick={() => setViewMode('recipes')}
              >
                <BookCopy className="mr-2 h-4 w-4" />
                {t('shoppingLists.viewByRecipes', 'Par recettes')}
              </button>
            </div>

            {viewMode === 'ingredients' ? (
              <ShoppingListByIngredients />
            ) : (
              <ShoppingListByRecipes />
            )}

            <ShoppingListProgress
              checkedCount={checkedCount}
              totalCount={total}
            />
          </div>
        )}
        {total === 0 && (
          <div className="flex flex-col items-center pt-60">
            <ShoppingBasket className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
              {t('shoppingLists.empty.title', 'Aucune liste de courses')}
            </h3>
            <p className="mb-4 max-w-md text-center text-muted-foreground">
              {t(
                'shoppingLists.empty.description',
                'Planifiez des repas pour créer automatiquement votre liste de courses.',
              )}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
