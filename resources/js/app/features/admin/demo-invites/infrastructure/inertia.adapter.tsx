import { createGenericContext } from '@/app/hooks/use-generic-context';
import { PageProps } from '@/types';
import type { DemoInviteResource } from '@/types/generated';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type Props = PageProps & {
  demoInvites: DemoInviteResource[];
};

export const {
  Provider: AdminDemoInvitesProvider,
  useContextValue: useAdminDemoInvitesContext,
} = createGenericContext<Props>();

export function AdminDemoInvitesInertiaAdapter({
  children,
}: PropsWithChildren) {
  const pageProps = usePage<Props>().props;
  return (
    <AdminDemoInvitesProvider data={pageProps}>
      {children}
    </AdminDemoInvitesProvider>
  );
}
