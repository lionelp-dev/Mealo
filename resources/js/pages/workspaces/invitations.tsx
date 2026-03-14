import { WorkspaceInertiaAdapter } from '@/features/workspaces/inertia.adapter';
import { WorkspacesInvitationsView } from '@/features/workspaces/views/index.workspace-invitations.view';

export default function WorkspaceInvitations() {
  return (
    <WorkspaceInertiaAdapter>
      <WorkspacesInvitationsView />
    </WorkspaceInertiaAdapter>
  );
}
