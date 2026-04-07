import { createGenericContext } from '@/app/hooks/use-generic-context';
import { PageProps, PaginatedCollection } from '@/types';
import { BetaRequest } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type Props = PageProps & {
  betaRequests: PaginatedCollection<BetaRequest>;
  stats: {
    pending: number;
    approved: number;
    converted: number;
    rejected: number;
    expired: number;
    active_beta_users: number;
    total: number;
  };
  filters: {
    status?: string;
    search?: string;
  };
};

export const {
  Provider: BetaRequestProvider,
  useContextValue: useBetaRequestContext,
} = createGenericContext<Props>();

export function BetaRequestInertiaAdapter({ children }: PropsWithChildren) {
  const pageProps = usePage<Props>().props;
  return <BetaRequestProvider data={pageProps}>{children}</BetaRequestProvider>;
}
