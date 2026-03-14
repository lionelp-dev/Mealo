import { WorkspaceInertiaAdapter } from '@/features/workspaces/inertia.adapter';
import { WorkspaceIndexView } from '@/features/workspaces/views/index.workspace.view';

export default function WorkspaceIndex() {
  return (
    <WorkspaceInertiaAdapter>
      <WorkspaceIndexView />
    </WorkspaceInertiaAdapter>
  );
}
