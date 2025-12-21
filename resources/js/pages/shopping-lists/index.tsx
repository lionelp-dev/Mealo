import { Head, usePage, usePrefetch } from '@inertiajs/react';

import { LanguageSwitcher } from '@/components/language-switcher';
import ShoppingListIngredientList from '@/components/shopping-list-ingredient-list';
import ShoppingListProgress from '@/components/shopping-list-progress';
import WeekSelector from '@/components/week-selector';
import AppLayout from '@/layouts/app-layout';
import shoppingLists from '@/routes/shopping-lists';
import { ShoppingList } from '@/types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type PageProps = {
  shoppingList: ShoppingList;
  weekStart: string;
};

export default function ShoppingListsIndex() {
  const { t } = useTranslation();
  const { flush } = usePrefetch();
  flush();

  const { shoppingList, weekStart } = usePage<PageProps>().props;
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
    <AppLayout
      headerLeftContent={
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={shoppingLists.index.url()}
        />
      }
      headerRightContent={<LanguageSwitcher />}
    >
      <Head title={t('shoppingLists.pageTitle')} />
      {ingredients.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-gray-500">
          <div className="text-center">
            <p className="text-lg text-base-content">
              No ingredients in this shopping list
            </p>
            <p className="text-sm text-base-content">
              Plan some meals to add ingredients
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-hidden px-10 py-5">
          <ShoppingListProgress
            checkedCount={checkedCount}
            totalCount={totalCount}
          />

          <div className="flex flex-1 gap-7 overflow-hidden max-xl:flex-col">
            {uncheckedIngredients.length > 0 && (
              <ShoppingListIngredientList
                title="To buy"
                description={`${uncheckedIngredients.length} items`}
                ingredients={uncheckedIngredients}
              />
            )}

            <ShoppingListIngredientList
              title="Completed"
              description={`${checkedIngredients.length} items checked off`}
              ingredients={checkedIngredients}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
