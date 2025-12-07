import { Head, usePage, usePrefetch } from '@inertiajs/react';

import ShoppingListIngredientList from '@/components/shopping-list-ingredient-list';
import WeekSelector from '@/components/week-selector';
import AppLayout from '@/layouts/app-layout';
import shoppingLists from '@/routes/shopping-lists';
import { ShoppingList } from '@/types';
import { DateTime } from 'luxon';

type PageProps = {
  shoppingList: ShoppingList;
  weekStart: string;
};

export default function ShoppingListsIndex() {
  const { flush } = usePrefetch();
  flush();

  const { shoppingList, weekStart } = usePage<PageProps>().props;

  return (
    <AppLayout
      headerLeftContent={
        <WeekSelector
          currentWeek={DateTime.fromISO(weekStart)}
          url={shoppingLists.index.url()}
        />
      }
    >
      <Head title="Shopping List" />
      <ShoppingListIngredientList shoppingList={shoppingList} />
    </AppLayout>
  );
}
