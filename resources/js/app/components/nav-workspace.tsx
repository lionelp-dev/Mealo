import { Typography } from '@/app/components/Typography';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/app/components/ui/sidebar';
import workspaceInvitationsRoute from '@/routes/workspace-invitations';
import workspacesRoute from '@/routes/workspaces';
import { WorkspaceData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PageProps = {
  workspace_data?: WorkspaceData;
};

export function NavWorkspace() {
  const { t } = useTranslation();

  const { workspace_data } = usePage<PageProps>().props;

  const workspaces = workspace_data?.workspaces ?? [];
  const pendingInvitationsCount =
    workspace_data?.workspaces_invitations?.length ?? 0;

  const sharedWorkspaces = workspaces?.filter((w) => !w.is_personal);

  return (
    <SidebarGroup>
      <SidebarSeparator className="mx-0 group-data-[state=expanded]:hidden" />
      <SidebarGroupLabel className="text-secondary uppercase">
        {t('workspace.sharedSpace', 'Espace partagé')}
      </SidebarGroupLabel>
      <SidebarMenu className="group-data-[state=collapsed]:py-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip={{ children: t('workspace.mySpaces', 'Mes espaces') }}
          >
            <Link
              href={workspacesRoute.index.url()}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <Typography as="span" variant="body-sm" tone="inherit">
                  {t('workspace.mySpaces', 'Mes espaces')}
                </Typography>
              </span>
              <Typography
                as="span"
                variant="caption"
                tone="inherit"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-center text-secondary-content"
              >
                {sharedWorkspaces.length}
              </Typography>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {pendingInvitationsCount > 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: t('workspace.invitations', 'Invitations') }}
            >
              <Link
                href={workspaceInvitationsRoute.index.url()}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <Bell />
                  <Typography as="span" variant="body-sm" tone="inherit">
                    {t('workspace.invitations', 'Invitations')}
                  </Typography>
                </span>
                <Typography
                  as="span"
                  variant="caption"
                  tone="inherit"
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-warning text-center text-secondary-content"
                >
                  {pendingInvitationsCount}
                </Typography>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>

      <SidebarSeparator className="mx-0 group-data-[state=expanded]:hidden" />
    </SidebarGroup>
  );
}
