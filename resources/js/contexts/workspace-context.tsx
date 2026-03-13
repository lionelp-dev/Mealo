import { createGenericContext } from '@/hooks/use-generic-context';
import { WorkspaceData } from '@/types';

const {
  Provider: WorkspaceDataProvider,
  useContextValue: useWorkspaceContext,
  useOptionalContextValue: useOptionalWorkspaceContext,
} = createGenericContext<{ workspace_data: WorkspaceData }>();

export {
  useOptionalWorkspaceContext,
  useWorkspaceContext,
  WorkspaceDataProvider,
};
