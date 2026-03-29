import { WorkspaceData } from '@/types';
import WorkspaceCreationModal from '@/app/features/workspaces/components/workspace-creation-modal';
import { WorkspaceEditModal } from '@/app/features/workspaces/components/workspace-edit-modal';
import { WorkspaceInvitationModal } from '@/app/features/workspaces/components/workspace-invitation-modal';
import { workspaceCreationStore } from '@/app/features/workspaces/stores/workspace-creation-modal-store';
import { workspaceInvitationModalStore } from '@/app/features/workspaces/stores/workspace-invitation-modal-store';
import { cn } from '@/app/lib/';
import { capitalize, pluralize } from '@/app/utils/';
import { router } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import {
  CheckIcon,
  ChevronDown,
  Plus,
  Settings,
  User,
  Users,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function NavWorkspaceSwitcher({
  workspace_data,
}: {
  workspace_data: WorkspaceData;
}) {
  const { t, i18n } = useTranslation();
  const [isWorkspaceSwitcherPopoverOpen, setWorkspaceSwitcherPopoverOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!workspace_data) return null;

  const { current_workspace, workspaces } = workspace_data;

  const { openWorkspaceCreationModal } = workspaceCreationStore();
  const { openWorkspaceInvitationModal } = workspaceInvitationModalStore();

  const handleSwitchWorkspace = (workspaceId: number) => {
    if (isLoading || workspaceId === current_workspace?.id) return;

    router.post(
      `/workspaces/${workspaceId}/switch`,
      {},
      {
        onBefore: () => setIsLoading(true),
        onFinish: () => {
          setIsLoading(false);
          setWorkspaceSwitcherPopoverOpen(false);
        },
      },
    );
  };

  if (!current_workspace) return null;

  return (
    <>
      <Popover.Root
        open={isWorkspaceSwitcherPopoverOpen}
        onOpenChange={setWorkspaceSwitcherPopoverOpen}
      >
        <Popover.Trigger asChild>
          <button
            className="btn items-center gap-2 border-secondary/40 bg-secondary/10 px-3 pl-4 text-sm text-secondary btn-soft hover:bg-secondary/10"
            disabled={isLoading}
          >
            <ChevronDown
              className={cn(
                'mr-0.5 h-3 w-3 shrink-0',
                isWorkspaceSwitcherPopoverOpen && '-scale-y-100',
              )}
            />
            <span className="truncate">
              {capitalize(current_workspace.name)}
            </span>
            <span className="text-xs font-normal">-</span>
            <span className="text-xs font-normal">
              {current_workspace.is_personal
                ? t('workspace.type.personal', 'Espace personnel')
                : t('workspace.type.shared', 'Espace partagé')}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/15">
              {current_workspace.is_personal ? (
                <User className="h-4 w-4" />
              ) : (
                <Users className="h-4 w-4" />
              )}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-10 flex w-82 flex-col gap-2 divide-y divide-base-300/50 rounded-xl border border-base-300/30 bg-base-100 px-2 py-3.5 pb-1 shadow-xl"
            align="end"
            sideOffset={8}
          >
            {workspaces.length !== 0 && (
              <div className="flex max-h-58 min-w-0 flex-col gap-2 pb-1">
                <span className="px-3 text-xs font-semibold text-secondary uppercase">
                  {t('workspace.mySpaces', 'Mes espaces')}
                </span>
                <div className="flex flex-col overflow-y-auto">
                  {[...workspaces]
                    .sort((a, b) =>
                      a.id === current_workspace.id
                        ? -1
                        : b.id === current_workspace.id
                          ? 1
                          : 0,
                    )
                    .map((workspace) => {
                      const isCurrent = workspace.id === current_workspace.id;
                      const last_update = DateTime.fromISO(
                        workspace.updated_at,
                      ).toRelative({ locale: i18n.language });
                      return (
                        <button
                          key={workspace.id}
                          onClick={() => handleSwitchWorkspace(workspace.id)}
                          className={cn(
                            'btn flex h-15 w-full min-w-0 items-center gap-1 rounded-md bg-transparent pr-4 pl-3.5 text-muted-foreground outline-none hover:bg-secondary/10',
                            isCurrent
                              ? 'border-0 border-l-2 border-secondary/80 bg-secondary/5'
                              : 'border-none',
                          )}
                        >
                          <span
                            className={cn(
                              '-ml-2 flex h-10 w-10 shrink-0 items-center justify-center',
                              isCurrent && 'text-secondary',
                            )}
                          >
                            {workspace.is_personal ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <Users className="h-5 w-5" />
                            )}
                          </span>
                          <span className="flex flex-1 flex-col">
                            <span className="text-left text-xs leading-5 font-semibold">
                              {capitalize(workspace.name)}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground/80">
                              <span className="text-left text-xs font-normal">
                                {t('workspace.modified', 'Modifié')}{' '}
                                {last_update}
                                <span>.</span>
                              </span>
                              <span className="flex gap-1 text-left text-xs font-normal">
                                <span>{workspace.users_count}</span>
                                <span>
                                  {pluralize(
                                    t('workspace.member', 'membre'),
                                    workspace.users_count,
                                  )}
                                </span>
                              </span>
                            </span>
                          </span>
                          {isCurrent && (
                            <CheckIcon className="text-secondary" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
            <div className="-mx-1 flex flex-col gap-2.5 pb-2">
              <span className="px-4 pt-1 text-xs font-semibold text-secondary uppercase">
                {t('workspace.actions', 'Actions')}
              </span>
              <button
                className="btn h-fit w-fit gap-2 border-none font-normal text-muted-foreground btn-ghost hover:bg-transparent hover:text-secondary hover:underline"
                onClick={() => openWorkspaceCreationModal()}
              >
                <Plus className="h-4 w-4 shrink-0 pt-[2px]" />
                {t('workspace.createNew', 'Créer un espace')}
              </button>
              {!current_workspace.is_default && (
                <button
                  className="btn h-fit w-fit gap-2 border-none font-normal text-muted-foreground btn-ghost hover:bg-transparent hover:text-secondary hover:underline"
                  onClick={() =>
                    openWorkspaceInvitationModal(current_workspace.id)
                  }
                >
                  <Settings className="h-4 w-4 shrink-0 pt-[2px]" />
                  {t('workspace.manageInvitations', 'Gérer les invitations')}
                </button>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <WorkspaceInvitationModal workspace_data={workspace_data} />
      <WorkspaceCreationModal />
      <WorkspaceEditModal workspace_data={workspace_data} />
    </>
  );
}
