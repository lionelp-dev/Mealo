import { useWorkspaces } from '../hooks/use-workspaces';
import { workspaceCreationStore } from '../stores/workspace-creation-modal-store';
import { workspaceInvitationModalStore } from '../stores/workspace-invitation-modal-store';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/app/components/ui/dialog';
import type { StoreWorkspaceRequest } from '@/app/data/requests/workspace/types';
import { useAppForm } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { useStore } from '@tanstack/react-form';
import { User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const workspaceTypes = [
  {
    value: true,
    icon: User,
    labelKey: 'workspace.type.personal',
    subtitleKey: 'workspace.type.personalHint',
  },
  {
    value: false,
    icon: Users,
    labelKey: 'workspace.type.shared',
    subtitleKey: 'workspace.type.sharedHint',
  },
] as const;

export default function WorkspaceCreationModal() {
  const { t } = useTranslation();
  const {
    isWorkspaceCreationModalOpen,
    isWorkspaceCreating,
    setWorkspaceCreating,
    closeWorkspaceCreationModal,
  } = workspaceCreationStore();

  const { openWorkspaceInvitationModal } = workspaceInvitationModalStore();

  const { handleCreateWorkspace } = useWorkspaces();

  const defaultValues: StoreWorkspaceRequest = {
    name: '',
    is_personal: true,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      handleCreateWorkspace(value, {
        onStart: () => setWorkspaceCreating(true),
        onSuccess: (page) => {
          closeWorkspaceCreationModal();
          setWorkspaceCreating(false);
          if (value.is_personal === true) return;
          const newWorkspaceId = page.props.flash.new_workspace_id;
          if (newWorkspaceId) openWorkspaceInvitationModal(newWorkspaceId);
        },
        onError: () => {
          setWorkspaceCreating(false);
        },
      });
    },
  });

  const isPersonal = useStore(
    form.baseStore,
    (state) => state.values.is_personal,
  );

  return (
    <Dialog
      open={isWorkspaceCreationModalOpen}
      onOpenChange={closeWorkspaceCreationModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="tracking-tight text-secondary">
            {t('workspace.create.title', 'Créer un espace')}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField
                label={t('workspace.fields.name', "Nom de l'espace")}
              />
            )}
          />
          <form.AppField
            name="is_personal"
            children={(field) => (
              <div className="flex gap-3">
                {workspaceTypes.map(
                  ({ value, icon: Icon, labelKey, subtitleKey }) => {
                    const selected = field.state.value === value;
                    return (
                      <label
                        key={String(value)}
                        className={cn(
                          `flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl border border-secondary/40 p-4 transition-colors`,
                          selected
                            ? 'bg-secondary/5 outline-offset-2 outline-secondary focus-within:outline-2'
                            : 'outline-base-300 hover:outline-secondary/50',
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          className="checkbox radio self-end radio-md radio-secondary"
                          placeholder={t(
                            'workspace.fields.namePlaceholder',
                            'Ex : Famille, Colocation…',
                          )}
                          checked={selected}
                          onChange={() => field.handleChange(value)}
                          onBlur={field.handleBlur}
                        />
                        <Icon
                          size={28}
                          className={
                            selected ? 'text-secondary' : 'text-base-content/50'
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${selected ? 'text-secondary' : 'text-base-content/50'}`}
                        >
                          {t(labelKey)}
                        </span>
                        <span
                          className={`text-xs ${selected ? 'text-secondary' : 'text-base-content/50'}`}
                        >
                          {t(subtitleKey)}
                        </span>
                      </label>
                    );
                  },
                )}
              </div>
            )}
          />

          <span className="text-xs font-normal text-muted-foreground">
            {isPersonal
              ? t(
                  'workspace.hints.personal',
                  'Gérez vos repas et plannings personnels.',
                )
              : t(
                  'workspace.hints.shared',
                  'Collaborez avec votre famille, colocataires ou amis.',
                )}
          </span>

          <div className="flex justify-end gap-4">
            <button
              className="btn"
              onClick={() => closeWorkspaceCreationModal()}
              disabled={isWorkspaceCreating}
            >
              {t('common.buttons.cancel', 'Annuler')}
            </button>
            <form.Subscribe>
              {(state) => (
                <button
                  className="btn w-fit gap-2 pl-4 btn-secondary"
                  type="button"
                  disabled={!state.canSubmit || isWorkspaceCreating}
                  onClick={() => {
                    form.handleSubmit();
                  }}
                >
                  <span>
                    {state.values.is_personal
                      ? isWorkspaceCreating
                        ? t('common.status.loading', 'Création...')
                        : t('common.buttons.create', 'Créer')
                      : t('common.buttons.continue', 'Continuer')}
                  </span>
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
