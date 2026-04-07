import type {
  AcceptWorkspaceInvitationRequest,
  DeclineWorkspaceInvitationRequest,
  DeleteWorkspaceMemberRequest,
  StoreWorkspaceInvitationRequest,
  StoreWorkspaceRequest,
  UpdateWorkspaceMemberRoleRequest,
  UpdateWorkspaceRequest,
} from '@/app/data/requests/workspace/types';
import workspaceInvitationsRoute from '@/routes/workspace-invitations';
import workspaces from '@/routes/workspaces';
import { SharedData } from '@/types';
import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export function useWorkspaces() {
  const { t } = useTranslation();

  const handleCreateWorkspace = (
    data: StoreWorkspaceRequest,
    callbacks?: {
      onStart?: () => void;
      onSuccess?: (page: { props: SharedData }) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    router.post(
      '/workspaces',
      {
        name: data.name.trim(),
        is_personal: data.is_personal,
      },
      {
        onStart: callbacks?.onStart,
        onSuccess: (page) =>
          callbacks?.onSuccess?.(page as unknown as { props: SharedData }),
        onError: callbacks?.onError,
      },
    );
  };

  const handleUpdateWorkspace = (
    workspaceId: number,
    data: UpdateWorkspaceRequest,
    callbacks?: {
      onStart?: () => void;
      onSuccess?: (page: { props: SharedData }) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    router.put(
      workspaces.update.url({ workspace: { id: workspaceId } }),
      {
        name: data.name,
        is_personal: data.is_personal,
      },
      {
        onStart: callbacks?.onStart,
        onSuccess: (page) =>
          callbacks?.onSuccess?.(page as unknown as { props: SharedData }),
        onError: callbacks?.onError,
      },
    );
  };

  const handleInvite = (
    data: StoreWorkspaceInvitationRequest,
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.post(
      workspaceInvitationsRoute.store.url({ workspace_id: data.workspace_id }),
      { email: data.email, role: data.role },
      {
        onBefore: callbacks?.onBefore,
        onFinish: callbacks?.onFinish,
      },
    );
  };

  const handleRemoveMember = (
    workspaceId: number,
    data: DeleteWorkspaceMemberRequest,
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.delete(workspaces.removeMember.url(workspaceId), {
      data: { user_id: data.user_id },
      onBefore: callbacks?.onBefore,
      onFinish: callbacks?.onFinish,
    });
  };

  const handleChangeRole = (
    workspaceId: number,
    data: UpdateWorkspaceMemberRoleRequest,
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.put(
      workspaces.updateMemberRole.url(workspaceId),
      {
        user_id: data.user_id,
        role: data.role,
      },
      {
        onBefore: callbacks?.onBefore,
        onFinish: callbacks?.onFinish,
      },
    );
  };

  const handleCancelInvitation = (
    invitationId: number,
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.delete(
      workspaceInvitationsRoute.destroy.url({ invitation: invitationId }),
      {
        onBefore: callbacks?.onBefore,
        onFinish: callbacks?.onFinish,
      },
    );
  };

  const handleAccept = (data: AcceptWorkspaceInvitationRequest) => {
    router.post(
      workspaceInvitationsRoute.accept.url(data.token),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const handleDecline = (data: DeclineWorkspaceInvitationRequest) => {
    router.post(
      workspaceInvitationsRoute.decline.url(data.token),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const formatExpirationDate = (expiresAtDate: string) => {
    const expiresAt = DateTime.fromISO(expiresAtDate);
    const now = DateTime.now();
    const diffInHours = expiresAt.diff(now, 'hours').hours;

    if (diffInHours < 24) {
      return t('invitation.expires.today', "Expire aujourd'hui");
    } else {
      const days = Math.floor(diffInHours / 24);
      return t('invitation.expires.inDays', `Expire dans ${days} jour`, {
        count: days,
        days,
      });
    }
  };

  const getRemainingDaysProgress = (expiresAtDate: string) => {
    const expiresAt = DateTime.fromISO(expiresAtDate);
    const now = DateTime.now();
    const invitationValidityDays = 7;
    const daysRemaining = expiresAt.diff(now, 'days').days;

    return {
      current: Math.max(
        0,
        Math.min(invitationValidityDays, Math.ceil(daysRemaining)),
      ),
      total: invitationValidityDays,
    };
  };

  const getRoleBadgeVariant = (memberRole: string | null) => {
    switch (memberRole) {
      case 'owner':
        return 'badge-warning';
      case 'editor':
        return 'badge-secondary';
      case 'viewer':
        return 'border-base-300';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (memberRole: string | null) => {
    switch (memberRole) {
      case 'owner':
        return t('workspace.role.owner', 'Propriétaire');
      case 'editor':
        return t('workspace.role.editor', 'Éditeur');
      case 'viewer':
        return t('workspace.role.viewer', 'Lecteur');
      default:
        return memberRole || t('workspace.role.unknown', 'Inconnu');
    }
  };

  return {
    handleCreateWorkspace,
    handleUpdateWorkspace,
    handleInvite,
    handleRemoveMember,
    handleChangeRole,
    handleCancelInvitation,
    handleAccept,
    handleDecline,
    formatExpirationDate,
    getRemainingDaysProgress,
    getRoleBadgeVariant,
    getRoleLabel,
  };
}
