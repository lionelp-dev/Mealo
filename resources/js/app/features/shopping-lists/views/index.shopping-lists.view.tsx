import { ShoppingListByIngredientCategories } from '../components/shopping-list-by-ingredient-categories';
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

  const { total, viewMode, checkedCount } = useShoppingList();

  return (
    <AppLayout
      renderHeaderLeftContent={({ mobileSidebarTrigger }) => (
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          leadingContent={mobileSidebarTrigger}
          url={shoppingLists.index.url()}
        />
      )}
      headerRightContent={
        <div className="flex items-center gap-4">
          <NavWorkspaceSwitcher workspace_data={workspace_data} />
        </div>
      }
    >
      <Head title={t('shoppingLists.pageTitle', 'Shopping Lists')} />

      <div className="sticky top-0 flex flex-col gap-1.25 border-b border-base-300/50 bg-base-100 px-4 py-3.25 md:px-12">
        <div className="flex items-end justify-between">
          <h1 className="text-xl font-bold text-secondary md:hidden">
            {t('shoppingLists.mobileTitle', 'Panier')}
          </h1>
          <h1 className="text-2xl font-bold text-secondary max-md:hidden">
            {t('shoppingLists.desktopTitle', 'Liste de courses')}
          </h1>
          <ShoppingListToggleView />
        </div>
        <ShoppingListProgress checkedCount={checkedCount} totalCount={total} />
      </div>

      <div className="flex h-full flex-col gap-5 overflow-y-auto bg-base-100 px-4 py-5 md:px-12">
        {total > 0 && (
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-7 md:gap-10 lg:grid-cols-3">
              {viewMode === 'ingredients' ? (
                <ShoppingListByIngredientCategories />
              ) : (
                <ShoppingListByRecipes />
              )}
            </div>
          </div>
        )}
        <ShoppingListEmptyView />
      </div>
    </AppLayout>
  );
}

function ShoppingListEmptyView() {
  const { t } = useTranslation();

  const { total } = useShoppingList();

  return (
    <>
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
    </>
  );
}

function ShoppingListToggleView() {
  const { t } = useTranslation();

  const { setViewMode, viewMode } = useShoppingList();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="tabs-boxed tabs h-fit w-fit shrink-0 rounded-md bg-secondary/15 tabs-xs min-md:tabs-sm">
        <button
          className={cn(
            'tab rounded-md px-2',
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
            'tab rounded-md px-2 text-secondary',
            viewMode === 'recipes' &&
              'tab-active bg-secondary text-secondary-content hover:text-white',
          )}
          onClick={() => setViewMode('recipes')}
        >
          <BookCopy className="mr-2 h-4 w-4" />
          {t('shoppingLists.viewByRecipes', 'Par recettes')}
        </button>
      </div>
    </div>
  );
}
