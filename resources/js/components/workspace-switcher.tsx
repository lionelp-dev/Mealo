import * as Popover from '@radix-ui/react-popover';

import { useWorkspaceContext } from '@/contexts/workspace-context';
import { workspaceCreationStore } from '@/stores/workspace-creation-modal-store';
import { workspaceInvitationModalStore } from '@/stores/workspace-invitation-modal-store';
import { router } from '@inertiajs/react';
import {
  Check,
  ChevronDown,
  Plus,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function WorkspaceSwitcher() {
  const { t } = useTranslation();

  const { workspace_data } = useWorkspaceContext();
  const { current_workspace, workspaces } = workspace_data;

  const [isWorkspaceSwitcherPopoverOpen, setWorkspaceSwitcherPopoverOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
    <Popover.Root
      open={isWorkspaceSwitcherPopoverOpen}
      onOpenChange={setWorkspaceSwitcherPopoverOpen}
    >
      <Popover.Trigger asChild>
        <button
          className="btn items-center justify-start gap-2 pl-7"
          disabled={isLoading}
        >
          <span>{t('workspace.planning', 'Planning')} {current_workspace.name.toLowerCase()}</span>
          {!current_workspace.is_personal && (
            <span className="flex items-center gap-1">
              ({current_workspace.users_count || 1})
            </span>
          )}
          {!current_workspace.is_personal && <UsersRound className="h-4 w-4" />}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-10 flex w-90 flex-col gap-4 rounded-md border border-base-300 bg-base-100 p-3"
          align="end"
          sideOffset={7}
        >
          <div className="flex flex-col gap-[2px] rounded-md border border-base-300 bg-base-200/20 p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t('workspace.current_workspace', 'Espace actuel')}
              </span>

              {!current_workspace.is_personal &&
                current_workspace.users_count && (
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span>{current_workspace.users_count}</span>
                      <span>{t('workspace.membersLabel', 'members')}</span>
                    </span>
                    <Users className="h-3 w-3" />
                  </span>
                )}
            </div>

            <span className="-mt-[1.25px] text-lg font-medium">
              {current_workspace.name}
            </span>

            {current_workspace.description && (
              <span className="text-xs text-muted-foreground">
                {current_workspace.description}
              </span>
            )}
          </div>

          <div className="divide flex max-h-48 flex-col divide-y divide-base-300 overflow-y-auto py-[2px]">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleSwitchWorkspace(workspace.id)}
                className="btn flex cursor-pointer items-center justify-between text-muted-foreground btn-ghost btn-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="-ml-1">
                    {workspace.is_personal ? (
                      <div className="h-4 w-4 rounded bg-neutral-200 dark:bg-neutral-700" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div className="font-medium">{workspace.name}</div>
                </div>
                {workspace.id === current_workspace.id && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>

          <button
            className="btn gap-2"
            onClick={() => openWorkspaceCreationModal()}
          >
            {t('workspace.createNew', 'Créer un espace')}
            <Plus className="h-4 w-4" />
          </button>

          <button
            className="btn"
            onClick={() => openWorkspaceInvitationModal(current_workspace)}
          >
            {t('workspace.manageInvitations', 'Gérer les invitations')}
            <Settings className="h-4 w-4" />
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
