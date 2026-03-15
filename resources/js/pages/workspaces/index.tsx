import { WorkspaceInertiaAdapter } from '@/app/features/workspaces/inertia.adapter';
import { WorkspaceIndexView } from '@/app/features/workspaces/views/index.workspace.view';

export default function WorkspaceIndex() {
  return (
    <WorkspaceInertiaAdapter>
      <WorkspaceIndexView />
    </WorkspaceInertiaAdapter>
  );
}
