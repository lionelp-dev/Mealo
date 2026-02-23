import { AppMainContent } from '@/components/app-main-content';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WorkspaceCreationModal from '@/components/workspace-creation-modal';
import { WorkspaceEditModal } from '@/components/workspace-edit-modal';
import { WorkspaceInvitationModal } from '@/components/workspace-invitation-modal';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import { usePermissions } from '@/hooks/use-permissions';
import { useWorkspaces } from '@/hooks/use-workspaces';
import AppLayout from '@/layouts/app-layout';
import { capitalize, cn, pluralize } from '@/lib/utils';
import workspacesRoute from '@/routes/workspaces';
import { workspaceCreationStore } from '@/stores/workspace-creation-modal-store';
import { workspaceEditStore } from '@/stores/workspace-edit-modal-store';
import { workspaceInvitationModalStore } from '@/stores/workspace-invitation-modal-store';
import { SharedData, WorkspaceData } from '@/types';
import { Head, router, usePage, usePoll } from '@inertiajs/react';
import {
  MoreHorizontal,
  Plus,
  PlusIcon,
  UserIcon,
  Users,
  UsersIcon,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export default function WorkspaceIndex() {
  const { t, i18n } = useTranslation();

  const { workspace_data, auth } = usePage<
    { workspace_data: WorkspaceData } & SharedData
  >().props;

  const { workspaces } = workspace_data;

  const { openWorkspaceCreationModal } = workspaceCreationStore();
  const { openWorkspaceEditModal } = workspaceEditStore();

  const { openWorkspaceInvitationModal } = workspaceInvitationModalStore();

  const { confirm, dialogProps } = useConfirmDialog();

  const { getRoleLabel } = useWorkspaces();

  const { canEditWorkspace } = usePermissions();

  usePoll(15000, {
    only: ['workspace_data'],
  });

  return (
    <WorkspaceDataProvider data={{ workspace_data }}>
      <AppLayout
        headerRightContent={
          <button
            className="btn pl-6 btn-secondary"
            onClick={() => openWorkspaceCreationModal()}
          >
            {t('workspace.create.button', 'Créer un espace')}
            <Plus className="h-4 w-4" />
          </button>
        }
      >
        <Head title={t('workspace.pageTitle', 'Mes groupes')} />

        <AppMainContent>
          <div className="grid h-full gap-8">
            <span className="flex flex-col">
              <span className="text-3xl leading-11 font-bold text-secondary">
                {t('workspace.mySpaces', 'Mes espaces')}
              </span>
              <span className="text-muted-foreground">
                {t(
                  'workspace.indexSubtitle',
                  'Gérez vos espaces personnels et collaboratifs',
                )}
              </span>
            </span>
            <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(354px,100%),1fr))] gap-8">
              {workspaces.map((workspace, idx) => {
                const member = {
                  role:
                    workspace.members.find(
                      (member) => member.id === auth.user.id,
                    )?.role ?? 'viewer',
                };
                const last_update = DateTime.fromISO(
                  workspace.updated_at,
                ).toRelative({ locale: i18n.language });
                return (
                  <div
                    className={cn(
                      'card rounded-xl border-t-2 bg-base-100 shadow-sm card-sm hover:scale-101',
                      workspace.is_personal
                        ? 'border-secondary'
                        : 'border-warning',
                    )}
                    key={idx}
                  >
                    <div className="card-body flex flex-col gap-3 pb-2.5">
                      <div className="flex justify-between">
                        <span className="card-title pl-1 text-secondary">
                          {capitalize(workspace.name)}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="space-y-2"
                          >
                            {canEditWorkspace(workspace) ? (
                              <>
                                <DropdownMenuItem asChild>
                                  <button
                                    className="btn btn-wide justify-center px-4 btn-ghost btn-sm hover:outline-none"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openWorkspaceEditModal(workspace.id);
                                    }}
                                  >
                                    {t('common.actions.edit', 'Modifier')}
                                  </button>
                                </DropdownMenuItem>
                                {!workspace.is_default && (
                                  <>
                                    <DropdownMenuItem asChild>
                                      <button
                                        className="btn btn-wide justify-center px-4 btn-ghost btn-sm hover:outline-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openWorkspaceInvitationModal(
                                            workspace.id,
                                          );
                                        }}
                                      >
                                        {t(
                                          'workspace.manageMembers',
                                          'Gérer les membres',
                                        )}
                                      </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="hover:!bg-none"
                                      asChild
                                    >
                                      <button
                                        className="btn btn-wide justify-center px-4 btn-ghost btn-sm hover:!bg-error/20 hover:outline-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          confirm({
                                            title: t(
                                              'workspace.delete.title',
                                              'Supprimer le groupe',
                                            ),
                                            message: t(
                                              'workspace.delete.message',
                                              `Êtes-vous sûr de vouloir supprimer définitivement le groupe "${workspace.name}" ? Cette action est irréversible.`,
                                              { name: workspace.name },
                                            ),
                                            submitBtnLabel: t(
                                              'common.buttons.delete',
                                              'Supprimer',
                                            ),
                                            onConfirm: () => {
                                              router.delete(
                                                workspacesRoute.destroy.url({
                                                  workspace: {
                                                    id: workspace.id,
                                                  },
                                                }),
                                              );
                                            },
                                          });
                                        }}
                                      >
                                        {t(
                                          'workspace.delete.button',
                                          'Supprimer',
                                        )}
                                      </button>
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </>
                            ) : (
                              <DropdownMenuItem asChild>
                                <button
                                  className="text-error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirm({
                                      message: t(
                                        'workspace.leave.message',
                                        `Êtes-vous sûr de vouloir quitter le groupe "${workspace.name}" ?`,
                                        { name: workspace.name },
                                      ),
                                      submitBtnLabel: t(
                                        'workspace.leave.confirmButton',
                                        'Quitter',
                                      ),
                                      onConfirm: () => {
                                        router.post(
                                          workspacesRoute.leave.url({
                                            workspace: { id: workspace.id },
                                          }),
                                        );
                                      },
                                    });
                                  }}
                                >
                                  {t(
                                    'workspace.leave.button',
                                    'Quitter le groupe',
                                  )}
                                </button>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-col gap-2 divide-y divide-base-300/40">
                        <div className="flex flex-col gap-4 pb-3">
                          <div className="flex gap-2">
                            <span
                              className={cn(
                                'badge rounded-full badge-sm',
                                workspace.is_personal
                                  ? 'badge-soft badge-secondary'
                                  : 'badge-soft badge-warning',
                              )}
                            >
                              {capitalize(
                                workspace.is_personal
                                  ? t('workspace.type.personal', 'Personnel')
                                  : t('workspace.type.shared', 'Partagé'),
                              )}
                            </span>
                            <span
                              className={cn(
                                'badge rounded-full badge-soft badge-sm badge-secondary',
                              )}
                            >
                              {getRoleLabel(member.role)}
                            </span>
                          </div>
                          <span className="flex w-fit items-center gap-1 rounded-full text-muted-foreground">
                            {workspace.users_count === 1 ? (
                              <UserIcon className="h-3.5 w-3.5" />
                            ) : (
                              <UsersIcon className="h-3.5 w-3.5" />
                            )}
                            <span className="leading-none">
                              {workspace.users_count}
                            </span>
                            <span>
                              {pluralize(
                                t('workspace.member', 'membre'),
                                workspace.users_count,
                              )}
                            </span>
                          </span>
                        </div>
                        <span className="flex w-full justify-end text-muted-foreground/80">
                          <span>{last_update}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                className="card h-auto flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary/20 bg-none text-secondary card-sm hover:border-secondary/60 hover:bg-secondary/5"
                onClick={() => openWorkspaceCreationModal()}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                  <PlusIcon className="h-5 w-5 text-secondary/60" />
                </span>
                <span className="text-sm">
                  {t('workspace.create.newSpace', 'Nouvel espace')}
                </span>
              </button>
            </div>
            {/* Empty State */}
            {workspaces.length === 0 && (
              <div className="row-start-4 flex flex-1 flex-col items-center justify-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                  {t('workspace.empty.title', 'Aucun groupe partagé')}
                </h3>
                <p className="mb-4 max-w-md text-center text-muted-foreground">
                  {t(
                    'workspace.empty.description',
                    "Créez votre premier groupe ou demandez une invitation pour collaborer avec d'autres personnes sur vos planifications de repas.",
                  )}
                </p>
              </div>
            )}
          </div>
        </AppMainContent>
        {dialogProps && <ConfirmDialog {...dialogProps} />}
      </AppLayout>{' '}
      <WorkspaceInvitationModal />
      <WorkspaceCreationModal />
      <WorkspaceEditModal />
    </WorkspaceDataProvider>
  );
}
