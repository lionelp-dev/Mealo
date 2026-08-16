import { createGenericContext } from '@/app/hooks/use-generic-context';
import { PageProps, PaginatedCollection } from '@/types';
import type { UserResource } from '@/types/generated';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type Props = PageProps & {
  users: PaginatedCollection<UserResource>;
  filters: {
    search: string;
  };
};

export const {
  Provider: AdminUsersProvider,
  useContextValue: useAdminUsersContext,
} = createGenericContext<Props>();

export function AdminUsersInertiaAdapter({ children }: PropsWithChildren) {
  const pageProps = usePage<Props>().props;
  return <AdminUsersProvider data={pageProps}>{children}</AdminUsersProvider>;
}
