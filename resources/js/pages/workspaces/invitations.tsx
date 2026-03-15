import { WorkspaceInertiaAdapter } from '@/app/features/workspaces/inertia.adapter';
import { WorkspacesInvitationsView } from '@/app/features/workspaces/views/index.workspace-invitations.view';

export default function WorkspaceInvitations() {
  return (
    <WorkspaceInertiaAdapter>
      <WorkspacesInvitationsView />
    </WorkspaceInertiaAdapter>
  );
}
