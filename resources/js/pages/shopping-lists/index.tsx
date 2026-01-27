import { Head, usePage, usePrefetch } from '@inertiajs/react';

import ShoppingListIngredientList from '@/components/shopping-list-ingredient-list';
import ShoppingListProgress from '@/components/shopping-list-progress';
import WeekSelector from '@/components/week-selector';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import AppLayout from '@/layouts/app-layout';
import shoppingLists from '@/routes/shopping-lists';
import { ShoppingList, WorkspaceData } from '@/types';
import { ShoppingBasket } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type PageProps = {
  shoppingList: ShoppingList;
  weekStart: string;
  workspace_data: WorkspaceData;
};

export default function ShoppingListsIndex() {
  const { t } = useTranslation();
  const { flush } = usePrefetch();
  flush();

  const { shoppingList, weekStart, workspace_data } =
    usePage<PageProps>().props;

  const ingredients = shoppingList?.data.ingredients || [];
  const totalCount = ingredients.length;

  const checkedIngredients = ingredients.filter(
    (ingredient) => ingredient.is_checked,
  );
  const checkedCount = checkedIngredients.length;

  const uncheckedIngredients = ingredients.filter(
    (ingredient) => !ingredient.is_checked,
  );

  return (
    <WorkspaceDataProvider data={{ workspace_data }}>
      <AppLayout
        headerLeftContent={
          <WeekSelector
            currentWeek={DateTime.fromISO(weekStart)}
            url={shoppingLists.index.url()}
          />
        }
        headerRightContent={
          <div className="flex items-center gap-4">
            <WorkspaceSwitcher />
          </div>
        }
      >
        <Head title={t('shoppingLists.pageTitle', 'Shopping Lists')} />
        <div className="flex h-full flex-col">
          {ingredients.length === 0 ? (
            /* Empty State */
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
          ) : (
            <div className="mx-auto flex w-[90%] flex-1 flex-col gap-9 overflow-y-auto py-9">
              <ShoppingListProgress
                checkedCount={checkedCount}
                totalCount={totalCount}
              />

              <div className="flex flex-1 gap-8 overflow-hidden max-xl:flex-col">
                {uncheckedIngredients.length > 0 && (
                  <ShoppingListIngredientList
                    title={t('shoppingLists.toBuy', 'To buy')}
                    description={t('shoppingLists.itemsCount', {
                      count: uncheckedIngredients.length,
                      defaultValue: `${uncheckedIngredients.length} items`,
                    })}
                    ingredients={uncheckedIngredients}
                  />
                )}

                <ShoppingListIngredientList
                  title={t('shoppingLists.completed', 'Completed')}
                  description={t('shoppingLists.itemsCheckedOff', {
                    count: checkedIngredients.length,
                    defaultValue: `${checkedIngredients.length} items checked off`,
                  })}
                  ingredients={checkedIngredients}
                />
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </WorkspaceDataProvider>
  );
}
