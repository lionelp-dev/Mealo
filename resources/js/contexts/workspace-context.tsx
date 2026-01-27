import { useGenericContext } from '@/hooks/use-generic-context';

import { WorkspaceData } from '@/types';

const {
  Provider: WorkspaceDataProvider,
  useContextValue: useWorkspaceContext,
} = useGenericContext<{ workspace_data: WorkspaceData }>();

export { useWorkspaceContext, WorkspaceDataProvider };
