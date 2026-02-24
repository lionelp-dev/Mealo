import { AppMainContent } from '@/components/app-main-content';
import { WorkspaceDataProvider } from '@/contexts/workspace-context';
import { useInitials } from '@/hooks/use-initials';
import { useWorkspaces } from '@/hooks/use-workspaces';
import AppLayout from '@/layouts/app-layout';
import { capitalize, pluralize } from '@/lib/utils';
import { SharedData, WorkspaceData, WorkspaceInvitation } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Check, Clock, MailOpen, User, Users, XCircle } from 'lucide-react';
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
          <div className="grid h-full gap-8">
            {/* Header Section */}
            <span className="flex flex-col">
              <span className="text-3xl leading-11 font-bold text-secondary">
                {t('invitation.title', 'Invitations aux groupes')}
              </span>
              <span className="text-muted-foreground">
                {t(
                  'invitation.subtitle',
                  'Gérez vos invitations aux espaces de planification partagés',
                )}
              </span>
            </span>

            {/* Invitations List */}
            {pending_invitations.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,36rem)] gap-8">
                {pending_invitations.map((invitation) => {
                  const progress = getRemainingDaysProgress(
                    invitation.expires_at,
                  );

                  return (
                    <div
                      key={invitation.id}
                      className="card rounded-xl border-t-3 border-secondary bg-base-100 py-1 shadow-sm card-sm"
                    >
                      <div className="card-body gap-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex w-full items-center justify-between">
                            <span className="badge inline-flex items-center gap-1.5 rounded-full badge-soft badge-sm badge-secondary">
                              <Clock className="h-4 w-4" />
                              {t('invitation.status.pending', 'En attente')}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {formatExpirationDate(invitation.expires_at)}
                              </span>
                            </span>
                          </div>
                          <progress
                            className="progress h-[3px] progress-warning"
                            value={progress.current}
                            max={progress.total}
                          ></progress>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            <Users className="h-6 w-6" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <span className="card-title pl-1 text-secondary">
                              {capitalize(invitation.workspace.name)}
                            </span>
                            <span className="flex gap-2">
                              <span className="badge rounded-full badge-soft badge-sm badge-secondary">
                                {t('workspace.type.shared', 'Espace partagé')}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{invitation.workspace.users_count}</span>
                                <span>
                                  {pluralize(
                                    t('workspace.member', 'membre'),
                                    invitation.workspace.users_count,
                                  )}
                                </span>
                                <span>
                                  {invitation.workspace.users_count === 1 ? (
                                    <User className="h-4 w-4" />
                                  ) : (
                                    <Users className="h-4 w-4" />
                                  )}
                                </span>
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 rounded-xl bg-secondary/5 p-4 font-normal text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>
                              {t('invitation.yourRole', 'Votre rôle')}
                            </span>
                            <span className="badge rounded-full badge-soft badge-sm badge-secondary">
                              {capitalize(invitation.role)}
                            </span>
                          </div>
                          {invitation.role === 'editor' && (
                            <>
                              <span className="text-xs">
                                {t(
                                  'workspace.permissions.editorDescription',
                                  'Consulter et modifier les repas',
                                )}
                              </span>
                              <span className="text-xs italic">
                                {t(
                                  'workspace.permissions.editorNote',
                                  'Gestion des membres non incluse',
                                )}
                              </span>
                            </>
                          )}
                          {invitation.role === 'viewer' && (
                            <>
                              <span className="text-xs">
                                {t(
                                  'workspace.permissions.viewerDescription',
                                  'Consulter les repas plannifiés',
                                )}
                              </span>
                            </>
                          )}
                        </div>

                        <span className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-seconday flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary/10">
                            {getInitials(invitation.invited_by.name)}
                          </span>
                          <span className="flex gap-1">
                            <span>
                              {t('workspace.invitedBy', 'Invited by')}{' '}
                            </span>
                            <span className="font-semibold">
                              {invitation.invited_by.name}
                            </span>
                            <span>
                              {t(
                                'workspace.roles.ownerLabel',
                                '· Propriétaire',
                              )}
                            </span>
                          </span>
                        </span>

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
                      </div>
                    </div>
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
