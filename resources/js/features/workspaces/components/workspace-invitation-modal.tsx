import { useWorkspacePermissions } from '../hooks/use-workspace-permissions';
import { useWorkspaces } from '../hooks/use-workspaces';
import { workspaceInvitationModalStore } from '../stores/workspace-invitation-modal-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppForm } from '@/hooks/form-hook';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { WorkspaceData } from '@/types';
import { Role } from '@/types/roles';
import {
  ArrowRightLeft,
  FolderOpen,
  MoreHorizontal,
  Trash,
  UserPlus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  workspace_data: WorkspaceData;
};

export function WorkspaceInvitationModal({ workspace_data }: Props) {
  const { t } = useTranslation();
  const getInitials = useInitials();

  const {
    isWorkspaceInvitationModalOpen,
    isWorkspaceInviting,
    setWorkspaceInviting,
    closeWorkspaceInvitationModal,
    selected_workspace_id,
  } = workspaceInvitationModalStore();

  const workspace = workspace_data.workspaces.find(
    (workspace) => workspace.id === selected_workspace_id,
  );

  const {
    handleInvite,
    handleCancelInvitation,
    handleChangeRole,
    handleRemoveMember,
    getRoleLabel,
    getRoleBadgeVariant,
  } = useWorkspaces();

  const { canEditCurrentWorkspace } = useWorkspacePermissions();

  const defaultValues: { email: string; role: Omit<Role, 'owner'> } = {
    email: '',
    role: 'editor',
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      if (!workspace) return;
      handleInvite(
        workspace.id,
        value as { email: string; role: 'editor' | 'viewer' },
        {
          onBefore: () => setWorkspaceInviting(true),
          onFinish: () => setWorkspaceInviting(false),
        },
      );
    },
  });

  if (!workspace || !isWorkspaceInvitationModalOpen) return null;

  const { members, pending_invitations } = workspace;

  return (
    <Dialog
      open={isWorkspaceInvitationModalOpen}
      onOpenChange={closeWorkspaceInvitationModal}
    >
      <DialogContent className="flex flex-col gap-4 px-4">
        <DialogTitle>
          <span className="badge flex gap-2 rounded-full badge-soft badge-xl pr-4 text-sm badge-secondary">
            <FolderOpen className="h-5 w-5" />
            <span className="flex items-center gap-1">
              <span>{t('workspace.label', 'Espace')}</span>
              <span>-</span>
              <span>{workspace.name}</span>
            </span>
          </span>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col">
            <span className="text-base leading-11 text-secondary">
              {t('workspace.inviteByEmail', 'Inviter par email')}
            </span>
            <div className="flex gap-3">
              <form.AppField
                name="email"
                children={(field) => (
                  <field.EmailField
                    placeholder={t(
                      'workspace.inviteEmail.placeholder',
                      'Email address',
                    )}
                  />
                )}
              />

              <form.AppField
                name="role"
                children={(field) => (
                  <field.SelectField
                    options={[
                      { value: 'editor', label: getRoleLabel('editor') },
                      { value: 'viewer', label: getRoleLabel('viewer') },
                    ]}
                  />
                )}
              />

              <form.Subscribe>
                {(state) => (
                  <button
                    className="btn w-fit gap-2.5 pr-5 pl-7 btn-secondary"
                    type="button"
                    disabled={!state.canSubmit || isWorkspaceInviting}
                    onClick={() => {
                      form.handleSubmit();
                    }}
                  >
                    <span>{t('workspace.invite.button', 'Invite')}</span>
                    <UserPlus className="h-4 w-4" />
                  </button>
                )}
              </form.Subscribe>
            </div>
          </div>
        </form>

        {/* Current members */}
        <div className="flex flex-col">
          <span className="text-base leading-10 text-secondary">
            {t('workspace.members.title', 'Membres')} {'( '}
            {members.length}
            {' )'}
          </span>
          <div className="flex max-h-48 flex-col gap-3 overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-base-300 p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-base font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'badge rounded-full',
                      `${getRoleBadgeVariant(member.role)}`,
                    )}
                  >
                    {getRoleLabel(member.role)}
                  </span>
                  {canEditCurrentWorkspace && member.role !== 'owner' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="btn btn-circle btn-ghost btn-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.role !== 'editor' && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeRole(
                                workspace.id,
                                member.id,
                                'editor',
                              )
                            }
                          >
                            {t('workspace.makeEditor', 'Changer en éditeur')}

                            <ArrowRightLeft className="h-4 w-4" />
                          </DropdownMenuItem>
                        )}
                        {member.role !== 'viewer' && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleChangeRole(
                                workspace.id,
                                member.id,
                                'viewer',
                              )
                            }
                          >
                            {t('workspace.makeViewer', 'Changer en lecteur')}

                            <ArrowRightLeft className="h-4 w-4" />
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            handleRemoveMember(workspace.id, member.id, {
                              onBefore: () => setWorkspaceInviting(true),
                              onFinish: () => setWorkspaceInviting(false),
                            })
                          }
                          className="justify-between text-destructive"
                        >
                          {t('workspace.removeMember', 'Retirer')}
                          <Trash className="h-4 w-4 text-destructive" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {pending_invitations && pending_invitations.length > 0 && (
          <div className="space-y-3">
            <span className="text-base leading-8 text-secondary">
              {t('workspace.pending_invitations', 'Invitations en attente')}{' '}
              {'( '}
              {pending_invitations.length}
              {' )'}
            </span>
            <div className="max-h-44 space-y-2 overflow-y-auto">
              {pending_invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between rounded-lg border border-dashed border-base-300 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(invitation.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-base font-medium">
                        {invitation.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('workspace.invitedBy', 'Invité par')}{' '}
                        {invitation.invited_by.name}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'badge rounded-full badge-soft',
                        `${getRoleBadgeVariant(invitation.role)}`,
                      )}
                    >
                      {getRoleLabel(invitation.role)}
                    </span>
                  </div>

                  {canEditCurrentWorkspace && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        handleCancelInvitation(invitation.id, {
                          onBefore: () => setWorkspaceInviting(true),
                          onFinish: () => setWorkspaceInviting(false),
                        })
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
