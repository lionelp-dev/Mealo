import workspaceInvitationsRoute from '@/routes/workspace-invitations';
import workspaces from '@/routes/workspaces';
import { SharedData, Workspace } from '@/types';
import { router } from '@inertiajs/react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export function useWorkspaces() {
  const { t } = useTranslation();

  const handleCreateWorkspace = (
    data: Pick<Workspace, 'name' | 'is_personal'>,
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
    data: Pick<Workspace, 'id' | 'name' | 'is_personal'>,
    callbacks?: {
      onStart?: () => void;
      onSuccess?: (page: { props: SharedData }) => void;
      onError?: (error: unknown) => void;
    },
  ) => {
    router.put(
      workspaces.update.url({ workspace: { id: data.id } }),
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

  const handleInvite = (
    workspaceId: number,
    values: {
      email: string;
      role: 'editor' | 'viewer';
    },
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.post(
      workspaceInvitationsRoute.store.url({ workspace: workspaceId }),
      values,
      {
        onBefore: callbacks?.onBefore,
        onFinish: callbacks?.onFinish,
      },
    );
  };

  const handleRemoveMember = (
    workspaceId: number,
    userId: number,
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.delete(`/workspaces/${workspaceId}/members`, {
      data: { user_id: userId },
      onBefore: callbacks?.onBefore,
      onFinish: callbacks?.onFinish,
    });
  };

  const handleChangeRole = (
    workspaceId: number,
    userId: number,
    newRole: 'editor' | 'viewer',
    callbacks?: {
      onBefore?: () => void;
      onFinish?: () => void;
    },
  ) => {
    router.put(
      `/workspaces/${workspaceId}/members/role`,
      {
        user_id: userId,
        role: newRole,
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
    router.delete(`/workspace-invitations/${invitationId}`, {
      onBefore: callbacks?.onBefore,
      onFinish: callbacks?.onFinish,
    });
  };

  const handleAccept = (invitationId: number) => {
    router.post(
      workspaceInvitationsRoute.acceptAuthenticated.url(invitationId),
      {},
      {
        preserveScroll: true,
      },
    );
  };

  const handleDecline = (invitationId: number) => {
    router.post(
      workspaceInvitationsRoute.declineAuthenticated.url(invitationId),
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

  const getRoleBadgeVariant = (memberRole: string) => {
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

  const getRoleLabel = (memberRole: string) => {
    switch (memberRole) {
      case 'owner':
        return t('workspace.role.owner', 'Propriétaire');
      case 'editor':
        return t('workspace.role.editor', 'Éditeur');
      case 'viewer':
        return t('workspace.role.viewer', 'Lecteur');
      default:
        return memberRole;
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
