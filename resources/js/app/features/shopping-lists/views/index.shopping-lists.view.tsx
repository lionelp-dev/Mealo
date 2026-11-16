import { ShoppingListByIngredientCategories } from '../components/shopping-list-by-ingredient-categories';
import ShoppingListByRecipes from '../components/shopping-list-by-recipes';
import ShoppingListProgress from '../components/shopping-list-progress';
import { useShoppingList } from '../hooks/use-shopping-list';
import { useShoppingListsContextValue } from '../inertia.adapter';
import { NavWorkspaceSwitcher } from '@/app/components/nav-workspace-switcher';
import { PageContainer } from '@/app/components/page-container';
import WeekSelector from '@/app/components/week-selector';
import { useWeekSelector } from '@/app/hooks/use-week-selector';
import AppLayout from '@/app/layouts/app-layout';
import { cn } from '@/app/lib/';
import shoppingLists from '@/routes/shopping-lists';
import { Head, usePrefetch } from '@inertiajs/react';
import { BookCopy, LayoutGrid, ShoppingBasket } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export default function ShoppingListsView() {
  const { t } = useTranslation();
  const { flush } = usePrefetch();
  flush();

  const { weekStart, workspace_data } = useShoppingListsContextValue();

  const { total, viewMode, checkedCount } = useShoppingList();
  const currentWeek = DateTime.fromISO(weekStart);
  const { goToCurrentWeek, goToPreviousWeek, goToNextWeek } = useWeekSelector({
    currentWeek,
    url: shoppingLists.index.url(),
  });

  return (
    <AppLayout
      renderHeaderLeftContent={({ mobileSidebarTrigger }) => (
        <WeekSelector
          currentWeek={currentWeek}
          leadingContent={mobileSidebarTrigger}
          onTodayClick={goToCurrentWeek}
          onPreviousWeekClick={goToPreviousWeek}
          onNextWeekClick={goToNextWeek}
        />
      )}
      headerRightContent={
        <div className="flex items-center gap-4">
          <NavWorkspaceSwitcher workspace_data={workspace_data} />
        </div>
      }
    >
      <Head title={t('shoppingLists.pageTitle', 'Shopping Lists')} />

      <PageContainer
        size="full"
        className="overflow-hidden bg-[#f1f4f9] py-0 dark:bg-base-200"
        contentClassName="flex min-h-0 flex-1 flex-col px-4 md:px-6"
      >
        <div className="shrink-0 pt-6 pb-5 md:pt-4 md:pb-4">
          <div className="flex flex-wrap items-center gap-4 md:px-3">
            <ShoppingListToggleView />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-5">
          {total > 0 && (
            <div className="flex w-full flex-1 flex-col gap-4">
              <div
                key={`${weekStart}-${workspace_data.current_workspace.id}-${viewMode}`}
                className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3"
              >
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

        <div className="-mx-4 shrink-0 border-t border-base-300/50 bg-[#f6f7f9] px-4 py-3.25 md:-mx-6 md:px-12">
          <ShoppingListProgress
            checkedCount={checkedCount}
            totalCount={total}
          />
        </div>
      </PageContainer>
    </AppLayout>
  );
}

function ShoppingListEmptyView() {
  const { t } = useTranslation();

  const { total } = useShoppingList();

  return (
    <>
      {total === 0 && (
        <div className="flex min-h-60 flex-1 flex-col items-center justify-center px-4 py-12">
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
    <div className="inline-flex shrink-0 rounded-xl border border-white/80 bg-secondary/5 p-1 dark:border-base-300">
      <button
        type="button"
        aria-pressed={viewMode === 'ingredients'}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          viewMode === 'ingredients'
            ? 'bg-secondary text-secondary-content shadow-sm'
            : 'text-secondary hover:bg-secondary/10',
        )}
        onClick={() => setViewMode('ingredients')}
      >
        <LayoutGrid aria-hidden="true" className="size-4" />
        {t('shoppingLists.viewByIngredients', 'Par ingrédients')}
      </button>
      <button
        type="button"
        aria-pressed={viewMode === 'recipes'}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          viewMode === 'recipes'
            ? 'bg-secondary text-secondary-content shadow-sm'
            : 'text-secondary hover:bg-secondary/10',
        )}
        onClick={() => setViewMode('recipes')}
      >
        <BookCopy aria-hidden="true" className="size-4" />
        {t('shoppingLists.viewByRecipes', 'Par recettes')}
      </button>
    </div>
  );
}
