import { Typography } from '@/app/components/Typography';
import WorkspaceCreationModal from '@/app/features/workspaces/components/workspace-creation-modal';
import { WorkspaceEditModal } from '@/app/features/workspaces/components/workspace-edit-modal';
import { WorkspaceInvitationModal } from '@/app/features/workspaces/components/workspace-invitation-modal';
import { workspaceCreationStore } from '@/app/features/workspaces/stores/workspace-creation-modal-store';
import { workspaceInvitationModalStore } from '@/app/features/workspaces/stores/workspace-invitation-modal-store';
import { cn } from '@/app/lib/';
import { capitalize, pluralize } from '@/app/utils/';
import { WorkspaceData } from '@/types';
import { router } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import clsx, { ClassValue } from 'clsx';
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

type Props = {
  className?: ClassValue;
  workspace_data: WorkspaceData;
};

export function NavWorkspaceSwitcher({ workspace_data, className }: Props) {
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
            className={clsx([
              'btn items-center gap-2 border-secondary/40 bg-secondary/10 text-secondary btn-soft hover:bg-secondary/10 max-lg:rounded-full',
              'max-md:flex-row-reverse max-md:pr-1.5 max-md:pl-1 max-md:btn-sm',
              className,
            ])}
            disabled={isLoading}
          >
            <ChevronDown
              className={cn(
                'mr-0.5 h-3 w-3 shrink-0',
                isWorkspaceSwitcherPopoverOpen && '-scale-y-100',
              )}
            />
            <Typography
              as="span"
              variant="body-sm"
              tone="inherit"
              className="truncate"
            >
              {capitalize(current_workspace.name)}
            </Typography>
            <Typography
              as="span"
              variant="caption"
              tone="inherit"
              className="max-md:hidden"
            >
              -
            </Typography>
            <Typography
              as="span"
              variant="caption"
              tone="inherit"
              className="max-md:hidden"
            >
              {current_workspace.is_personal
                ? t('workspace.type.personal', 'Espace personnel')
                : t('workspace.type.shared', 'Espace partagé')}
            </Typography>
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
                <Typography
                  as="span"
                  variant="overline"
                  tone="secondary"
                  className="px-3"
                >
                  {t('workspace.mySpaces', 'Mes espaces')}
                </Typography>
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
                            <Typography
                              as="span"
                              variant="caption"
                              tone="inherit"
                              weight="semibold"
                              className="text-left"
                            >
                              {capitalize(workspace.name)}
                            </Typography>
                            <span className="flex items-center gap-1 text-muted-foreground/80">
                              <Typography
                                as="span"
                                variant="caption"
                                tone="inherit"
                                className="text-left"
                              >
                                {t('workspace.modified', 'Modifié')}{' '}
                                {last_update}
                                <Typography
                                  as="span"
                                  variant="body-sm"
                                  tone="inherit"
                                >
                                  .
                                </Typography>
                              </Typography>
                              <span className="flex gap-1 text-left text-xs font-normal">
                                <Typography
                                  as="span"
                                  variant="body-sm"
                                  tone="inherit"
                                >
                                  {workspace.users_count}
                                </Typography>
                                <Typography
                                  as="span"
                                  variant="body-sm"
                                  tone="inherit"
                                >
                                  {pluralize(
                                    t('workspace.member', 'membre'),
                                    workspace.users_count,
                                  )}
                                </Typography>
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
              <Typography
                as="span"
                variant="overline"
                tone="secondary"
                className="px-4 pt-1"
              >
                {t('workspace.actions', 'Actions')}
              </Typography>
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
