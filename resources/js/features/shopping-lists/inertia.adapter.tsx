import { createGenericContext } from '@/shared/hooks/use-generic-context';
import { PageProps, ShoppingList, WorkspaceData } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type Props = PageProps & {
  shopping_list_data: ShoppingList;
  weekStart: string;
  workspace_data: WorkspaceData;
};

export const {
  Provider: ShoppingListsProvider,
  useContextValue: useShoppingListsContextValue,
} = createGenericContext<Props & { url: string }>();

export function ShoppingListsInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<Props>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);
  return <ShoppingListsProvider data={data}>{children}</ShoppingListsProvider>;
}
