import { createGenericContext } from '@/shared/hooks/use-generic-context';
import { PageProps, WorkspaceData, WorkspaceInvitation } from '@/types';
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type Props = PageProps & {
  workspace_data: WorkspaceData;
  pending_invitations: WorkspaceInvitation[];
};

export const {
  Provider: WorkspaceProvider,
  useContextValue: useWorkspaceContextValue,
} = createGenericContext<Props & { url: string }>();

export function WorkspaceInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<Props>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);

  usePoll(15000, {
    only: ['workspace_data'],
  });

  return <WorkspaceProvider data={data}>{children}</WorkspaceProvider>;
}
