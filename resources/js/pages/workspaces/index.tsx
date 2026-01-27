import { AppMainContent } from '@/components/app-main-content';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WorkspaceCreationModal from '@/components/workspace-creation-modal';
import { WorkspaceInvitationModal } from '@/components/workspace-invitation-modal';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import AppLayout from '@/layouts/app-layout';
import plannedMeals from '@/routes/planned-meals';
import workspacesRoute from '@/routes/workspaces';
import { workspaceCreationStore } from '@/stores/workspace-creation-modal-store';
import { workspaceInvitationModalStore } from '@/stores/workspace-invitation-modal-store';
import { SharedData, WorkspaceData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Crown, Edit, Eye, MoreHorizontal, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WorkspaceIndex() {
  const { t } = useTranslation();

  const { workspace_data, auth } = usePage<
    { workspace_data: WorkspaceData } & SharedData
  >().props;

  const { workspaces, current_workspace } = workspace_data;

  const sharedWorkspaces = workspaces.filter((w) => !w.is_personal);

  const { openWorkspaceCreationModal } = workspaceCreationStore();

  const { openWorkspaceInvitationModal } = workspaceInvitationModalStore();

  const { confirm, dialogProps } = useConfirmDialog();

  const getRoleIcon = (role?: string, isOwner?: boolean) => {
    if (isOwner) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (role === 'editor') return <Edit className="h-4 w-4 text-blue-500" />;
    return <Eye className="h-4 w-4 text-gray-500" />;
  };

  const getRoleLabel = (role?: string, isOwner?: boolean) => {
    if (isOwner) return t('workspace.roles.owner', 'Propriétaire');
    if (role === 'editor') return t('workspace.roles.editor', 'Éditeur');
    return t('workspace.roles.viewer', 'Lecteur');
  };

  return (
    <WorkspaceDataProvider data={{ workspace_data }}>
      <AppLayout
        headerRightContent={
          <button
            className="btn pl-6"
            onClick={() => openWorkspaceCreationModal()}
          >
            {t('workspace.create.button', 'Créer un groupe')}
            <Plus className="h-4 w-4" />
          </button>
        }
      >
        <Head title={t('workspace.pageTitle', 'Mes groupes')} />

        <AppMainContent>
          <div className="grid h-full gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2.5">
              <h1 className="text-2xl font-bold text-foreground">
                {t('workspace.title', 'Mes groupes')}
              </h1>
              <span className="text-muted-foreground">
                {t('workspace.subtitle', 'Espaces de planification partagés')}
              </span>
            </div>

            {/* Workspaces Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,25rem)] gap-9">
              {sharedWorkspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="cursor-pointer justify-between gap-9 border-base-300 px-1 py-8 transition-shadow hover:shadow-md"
                  onClick={() => {
                    router.post(
                      workspacesRoute.switch.url({
                        workspace: { id: workspace.id },
                      }),
                      {},
                      { onFinish: () => router.get(plannedMeals.index.url()) },
                    );
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>
                        {workspace.description && (
                          <CardDescription className="mt-1">
                            {workspace.description}
                          </CardDescription>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="space-y-2">
                          {workspace.owner_id === auth.user.id ? (
                            <>
                              <DropdownMenuItem asChild>
                                <button
                                  className="btn btn-wide justify-start px-4 btn-ghost btn-sm hover:outline-none"
                                  onClick={() =>
                                    openWorkspaceInvitationModal(workspace)
                                  }
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
                                  className="btn btn-wide justify-start px-4 btn-ghost btn-sm hover:!bg-error/20 hover:outline-none"
                                  onClick={(e) => {
                                    e.preventDefault();
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
                                      submitBtnLabel: 'supprimer',
                                      onConfirm: () => {
                                        router.delete(
                                          workspacesRoute.destroy.url({
                                            workspace: { id: workspace.id },
                                          }),
                                        );
                                      },
                                    });
                                  }}
                                >
                                  {t('workspace.delete.button', 'Supprimer')}
                                </button>
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem asChild>
                              <button
                                className="text-error"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  confirm({
                                    message: t(
                                      'workspace.leave.message',
                                      `Êtes-vous sûr de vouloir quitter le groupe "${workspace.name}" ?`,
                                      { name: workspace.name },
                                    ),
                                    submitBtnLabel: 'Quitter',
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
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(
                          workspace.user_role,
                          workspace.owner_id === current_workspace?.owner_id,
                        )}
                        <span className="text-sm text-muted-foreground">
                          {getRoleLabel(
                            workspace.members.find(
                              (member) => member.id === auth.user.id,
                            )?.role,
                            auth.user.id === workspace.owner_id,
                          )}
                        </span>
                      </div>
                      <span className="badge badge-soft badge-secondary">
                        {workspace.users_count}{' '}
                        {t('workspace.membersLabel', 'members')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {sharedWorkspaces.length === 0 && (
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
        <WorkspaceInvitationModal />
        <WorkspaceCreationModal />
      </AppLayout>
    </WorkspaceDataProvider>
  );
}
