import { createGenericContext } from '@/hooks/use-generic-context';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type Props = PageProps & {
  stats: {
    total_users: number;
    beta_users: number;
    pending_beta_requests: number;
    total_recipes: number;
    total_workspaces: number;
    recent_signups_week: number;
  };
};

export const {
  Provider: AdminDashboardProvider,
  useContextValue: useAdminDashboardContext,
} = createGenericContext<Props>();

export function AdminDashboardInertiaAdapter({ children }: PropsWithChildren) {
  const pageProps = usePage<Props>().props;
  return (
    <AdminDashboardProvider data={pageProps}>{children}</AdminDashboardProvider>
  );
}
