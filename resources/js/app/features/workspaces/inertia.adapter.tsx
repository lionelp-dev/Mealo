import { createGenericContext } from '@/app/hooks/use-generic-context';
import { SharedData, WorkspaceData } from '@/types';
import { usePage, usePoll } from '@inertiajs/react';
import { PropsWithChildren, useMemo } from 'react';

type PageProps = SharedData & {
  workspace_data: WorkspaceData;
};

export const {
  Provider: WorkspaceProvider,
  useContextValue: useWorkspaceContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function WorkspaceInertiaAdapter({ children }: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(() => ({ ...pageProps, url }), [pageProps]);

  usePoll(15000, {
    only: ['workspace_data'],
  });

  return <WorkspaceProvider data={data}>{children}</WorkspaceProvider>;
}
