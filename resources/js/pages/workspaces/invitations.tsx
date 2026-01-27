import { AppMainContent } from '@/components/app-main-content';
import { Card } from '@/components/ui/card';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import { useInitials } from '@/hooks/use-initials';
import { useWorkspaces } from '@/hooks/use-workspaces';
import AppLayout from '@/layouts/app-layout';
import { SharedData, WorkspaceData, WorkspaceInvitation } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Check, Clock, MailOpen, X, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InvitationsPage() {
  const { t } = useTranslation();

  const getInitials = useInitials();

  const { pending_invitations, workspace_data } = usePage<
    {
      pending_invitations: WorkspaceInvitation[];
      workspace_data: WorkspaceData;
    } & SharedData
  >().props;

  const {
    formatExpirationDate,
    getRemainingDaysProgress,
    handleAccept,
    handleDecline,
  } = useWorkspaces();

  return (
    <WorkspaceDataProvider data={{ workspace_data }}>
      <AppLayout>
        <Head title={t('invitation.pageTitle', 'Invitations')} />

        <AppMainContent>
          <div className="grid h-full gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2.5">
              <h1 className="text-2xl font-bold text-base-content">
                {t('invitation.title', 'Invitations aux groupes')}
              </h1>
              <span className="text-md text-muted-foreground/90">
                {t(
                  'invitation.subtitle',
                  'Gérez vos invitations aux espaces de planification partagés',
                )}
              </span>
            </div>

            {/* Invitations List */}
            {pending_invitations.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,36rem)] gap-8">
                {pending_invitations.map((invitation) => {
                  const progress = getRemainingDaysProgress(
                    invitation.expires_at,
                  );

                  return (
                    <Card
                      key={invitation.id}
                      className="flex flex-col gap-4 overflow-hidden border-1 border-base-300 px-3 pt-6.5 transition-all hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-5 px-3">
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-4">
                            {/* Status Badge */}
                            <div className="badge inline-flex items-center gap-1.5 badge-soft badge-secondary">
                              <MailOpen className="h-3 w-3" />
                              {t('invitation.status.pending', 'En attente')}
                            </div>

                            {/* Title & Description */}
                            <span className="px-3">
                              <h3 className="text-lg font-semibold text-foreground">
                                {invitation.workspace.name}
                              </h3>
                              {invitation.workspace.description && (
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                  {invitation.workspace.description}
                                </p>
                              )}
                            </span>

                            {/* Invited By */}
                            <div className="flex items-center gap-3 px-3">
                              <div className="relative h-12.5 w-12.5 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/60">
                                <div className="flex h-full items-center justify-center font-semibold text-white">
                                  {getInitials(invitation.invited_by.name)}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                  <span>{t('workspace.invitedBy', 'Invited by')} </span>
                                  {invitation.invited_by.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {t(
                                    'workspace.owner.label',
                                    'Owner du workspace',
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex basis-[30%] flex-col gap-5">
                            {/* Role */}
                            <span className="badge items-center self-end badge-soft bg-base-200/30 badge-sm overflow-ellipsis whitespace-nowrap text-muted-foreground/70">
                              {invitation.role === 'editor'
                                ? t('workspace.roles.editor', 'Éditeur')
                                : t(
                                    'workspace.roles.viewer',
                                    'Accès en lecture seul',
                                  )}
                            </span>

                            {/* Permissions Section */}
                            <div className="rounded-lg bg-base-200/30 px-5 py-4">
                              <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                                {t(
                                  'workspace.permissions.title',
                                  'Permissions',
                                )}
                              </h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                  <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                  <span className="text-xs text-muted-foreground">
                                    {t(
                                      'workspace.permissions.viewPlanning',
                                      'Consulter',
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  {invitation.role === 'editor' ? (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                  ) : (
                                    <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {t(
                                      'workspace.permissions.editMeals',
                                      'Modifier',
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                                  <span className="text-xs text-muted-foreground">
                                    {t(
                                      'workspace.permissions.manageMembers',
                                      'Gérer',
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          {/* Members */}
                          <span className="badge flex gap-1 self-center badge-soft badge-sm font-medium text-muted-foreground badge-secondary">
                            {t('workspace.members.title', 'Membres')}
                            <span>
                              ({invitation.workspace.users_count ?? 0})
                            </span>
                          </span>

                          {/* Expiration */}
                          <div className="flex basis-[60%] flex-col gap-2 self-center">
                            <span className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-orange-800 dark:text-orange-400" />
                              <span className="text-xs font-medium text-orange-800 dark:text-orange-400">
                                {formatExpirationDate(invitation.expires_at)}
                              </span>
                            </span>
                            <progress
                              className="progress progress-warning"
                              value={progress.current}
                              max={progress.total}
                            ></progress>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 border-t border-base-300/30 bg-muted/20 px-3 pt-5">
                        <button
                          className="btn flex-1 border-2 btn-secondary"
                          onClick={() => handleAccept(invitation.id)}
                        >
                          {t('workspace.invitation.accept', 'Accepter')}
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          className="btn flex-1 border-2"
                          onClick={() => handleDecline(invitation.id)}
                        >
                          {t('workspace.invitation.decline', 'Décliner')}
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="row-start-4 flex flex-1 flex-col items-center justify-center">
                <MailOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                  {t('invitation.empty.title', 'Aucune invitation en attente')}
                </h3>
                <p className="mb-4 max-w-md text-center text-muted-foreground">
                  {t(
                    'invitation.empty.description',
                    "Vous n'avez actuellement aucune invitation. Lorsque quelqu'un vous invitera à rejoindre un groupe, vous le verrez ici.",
                  )}
                </p>
              </div>
            )}
          </div>
        </AppMainContent>
      </AppLayout>
    </WorkspaceDataProvider>
  );
}
