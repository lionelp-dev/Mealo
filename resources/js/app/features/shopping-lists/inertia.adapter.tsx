import { SharedData } from '@/app/entities/';
import { ShoppingList } from '@/app/entities/shopping-list/types';
import { WorkspaceData } from '@/app/entities/workspace/types';
import { createGenericContext } from '@/app/hooks/use-generic-context';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  shopping_list_data: ShoppingList;
  weekStart: string;
  workspace_data: WorkspaceData;
};

export const {
  Provider: ShoppingListsProvider,
  useContextValue: useShoppingListsContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function ShoppingListsInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);
  return <ShoppingListsProvider data={data}>{children}</ShoppingListsProvider>;
}
