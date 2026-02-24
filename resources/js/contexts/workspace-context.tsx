/* eslint-disable react-hooks/rules-of-hooks */
import { useGenericContext } from '@/hooks/use-generic-context';

import { WorkspaceData } from '@/types';

 
const {
  Provider: WorkspaceDataProvider,
  useContextValue: useWorkspaceContext,
  useOptionalContextValue: useOptionalWorkspaceContext,
} = useGenericContext<{ workspace_data: WorkspaceData }>();

export {
  useOptionalWorkspaceContext,
  useWorkspaceContext,
  WorkspaceDataProvider,
};
