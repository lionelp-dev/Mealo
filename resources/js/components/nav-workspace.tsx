import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import workspaceInvitationsRoute from '@/routes/workspace-invitations';
import workspacesRoute from '@/routes/workspaces';
import { WorkspaceData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NavWorkspace({}) {
  const { t } = useTranslation();

  const { workspace_data } = usePage<{ workspace_data: WorkspaceData }>().props;

  if (workspace_data === undefined) return null;

  const workspaces = workspace_data.workspaces || [];
  const pendingInvitationsCount =
    workspace_data.pending_invitations?.length || 0;

  const sharedWorkspaces = workspaces?.filter((w: any) => !w.is_personal);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-secondary uppercase">
        {t('workspace.sharedSpace', 'Espace partagé')}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={workspacesRoute.index.url()}
                className="flex items-center justify-between"
              >
                <span className="mb-[3px] flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  <span>{t('workspace.mySpaces', 'Mes espaces')}</span>
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-center text-xs text-secondary-content">
                  {sharedWorkspaces.length}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {pendingInvitationsCount > 0 && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={workspaceInvitationsRoute.index.url()}
                  className="flex items-center justify-between"
                >
                  <span className="mb-[3px] flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <span>{t('workspace.invitations', 'Invitations')}</span>
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning text-center text-xs text-secondary-content">
                    {pendingInvitationsCount}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
