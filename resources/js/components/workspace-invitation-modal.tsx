import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useAppForm } from '@/hooks/form-hook';
import { useInitials } from '@/hooks/use-initials';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { cn } from '@/lib/utils';
import { workspaceInvitationModalStore } from '@/stores/workspace-invitation-modal-store';
import { SharedData } from '@/types';
import { Role } from '@/types/roles';
import { usePage } from '@inertiajs/react';
import { ArrowRightLeft, MoreHorizontal, Trash, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function WorkspaceInvitationModal() {
  const { t } = useTranslation();
  const getInitials = useInitials();

  const { auth, workspace_data } = usePage<SharedData>().props;
  const workspaces = workspace_data?.workspaces || [];

  // Store Zustand directement
  const {
    isWorkspaceInvitationModalOpen,
    data,
    isWorkspaceInviting,
    setWorkspaceInviting,
    closeWorkspaceInvitationModal,
  } = workspaceInvitationModalStore();

  const workspace = workspaces.find((w) => w.id === data?.workspace.id);

  // Hook uniquement pour les actions API et utilitaires
  const {
    handleInvite,
    handleCancelInvitation,
    handleChangeRole,
    handleRemoveMember,
    getRoleLabel,
    getRoleBadgeVariant,
  } = useWorkspaces();

  const defaultValues: { email: string; role: Omit<Role, 'owner'> } = {
    email: '',
    role: 'editor',
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      if (!workspace) return;
      handleInvite(workspace.id, value, {
        onBefore: () => setWorkspaceInviting(true),
        onFinish: () => setWorkspaceInviting(false),
      });
    },
  });

  if (!workspace || !isWorkspaceInvitationModalOpen) return null;

  const { members, pending_invitations } = workspace;

  return (
    <Dialog
      open={isWorkspaceInvitationModalOpen}
      onOpenChange={closeWorkspaceInvitationModal}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('workspace.manageMembers', 'Gérer les membres')}
          </DialogTitle>
          <DialogDescription>
            {workspace?.name && (
              <>
                {t('workspace.manageMembersFor', 'Gérer les membres de')} "
                {workspace.name}"
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-3">
              <h4>{t('workspace.inviteByEmail', 'Inviter par email')}</h4>
              <div className="flex gap-2">
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
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.EmailField placeholder={t('workspace.inviteEmail.placeholder', 'Email address')} />
                  )}
                />
                <form.Subscribe>
                  {(state) => (
                    <button
                      className="btn w-fit gap-2 pl-6 btn-secondary"
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
          <div className="space-y-3">
            <h4>
              {t('workspace.members.title', 'Membres')} ({members.length})
            </h4>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-base-300 p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.email}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'badge',
                        `badge-${getRoleBadgeVariant(member.role)}`,
                      )}
                    >
                      {getRoleLabel(member.role)}
                    </span>
                  </div>

                  {member.role !== 'owner' &&
                    auth.user.id === workspace?.owner_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="btn btn-ghost btn-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {member.role !== 'editor' && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(
                                  workspace.id,
                                  member.id,
                                  'editor',
                                  {
                                    onBefore: () => setWorkspaceInviting(true),
                                    onFinish: () => setWorkspaceInviting(false),
                                  },
                                )
                              }
                            >
                              {t('workspace.makeEditor', 'Changer en éditeur')}

                              <ArrowRightLeft className="mr-2 h-4 w-4" />
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'viewer' && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(
                                  workspace.id,
                                  member.id,
                                  'viewer',
                                  {
                                    onBefore: () => setWorkspaceInviting(true),
                                    onFinish: () => setWorkspaceInviting(false),
                                  },
                                )
                              }
                            >
                              {t('workspace.makeViewer', 'Changer en lecteur')}

                              <ArrowRightLeft className="mr-2 h-4 w-4" />
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
                            <Trash className="mr-2 h-4 w-4 text-destructive" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              ))}
            </div>
          </div>

          {pending_invitations && pending_invitations.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">
                  {t('workspace.pending_invitations', 'Invitations en attente')}
                  ({pending_invitations.length})
                </h4>
                <div className="max-h-32 space-y-2 overflow-y-auto">
                  {pending_invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between rounded-lg border border-dashed p-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(invitation.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {invitation.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('workspace.invitedBy', 'Invité par')}{' '}
                            {invitation.invited_by.name}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'badge',
                            `badge-${getRoleBadgeVariant(invitation.role)}`,
                          )}
                        >
                          {getRoleLabel(invitation.role)}
                        </span>
                      </div>

                      {auth.user.id === workspace?.owner_id && (
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
