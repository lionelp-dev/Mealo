import { useWorkspaces } from '../hooks/use-workspaces';
import { workspaceEditStore } from '../stores/workspace-edit-modal-store';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Workspace, WorkspaceData } from '@/app/entities/workspace/types';
import { useAppForm } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { useStore } from '@tanstack/react-form';
import { AlertTriangle, User, Users } from 'lucide-react';
import { useState } from 'react';
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

type Props = {
  workspace_data: WorkspaceData;
};

export function WorkspaceEditModal({ workspace_data }: Props) {
  const { t } = useTranslation();
  const {
    isWorkspaceEditModalOpen,
    selected_workspace_id,
    closeWorkspaceEditModal,
  } = workspaceEditStore();

  const selected_workspace = workspace_data.workspaces.find(
    (workspace) => workspace.id === selected_workspace_id,
  );
  return (
    <Dialog
      open={isWorkspaceEditModalOpen}
      onOpenChange={closeWorkspaceEditModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="text-secondary">
              {t('workspace.edit.title', "Modifier l'espace")}
            </span>
          </DialogTitle>
        </DialogHeader>
        {selected_workspace && (
          <WorkspaceEditForm
            key={selected_workspace.id}
            workspace={selected_workspace}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function WorkspaceEditForm({ workspace }: { workspace: Workspace }) {
  const { t } = useTranslation();
  const { isWorkspaceUpdating, setWorkspaceUpdating, closeWorkspaceEditModal } =
    workspaceEditStore();

  const { handleUpdateWorkspace } = useWorkspaces();

  const [confirmingPersonal, setConfirmingPersonal] = useState(false);

  const nonOwnerMembersCount = workspace.members.filter(
    (m) => m.id !== workspace.owner_id,
  ).length;

  const form = useAppForm({
    defaultValues: {
      name: workspace.name,
      is_personal: workspace.is_personal,
    },
    onSubmit: ({ value }) => {
      handleUpdateWorkspace(
        { id: workspace.id, ...value },
        {
          onStart: () => setWorkspaceUpdating(true),
          onSuccess: () => {
            closeWorkspaceEditModal();
            setWorkspaceUpdating(false);
          },
          onError: () => {
            setWorkspaceUpdating(false);
          },
        },
      );
    },
  });

  const isPersonal =
    useStore(form.baseStore, (state) => state.values.is_personal) ?? true;

  return (
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
      {!workspace.is_default && (
        <>
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
                          `flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border-2 p-4 text-secondary transition-colors`,
                          selected
                            ? confirmingPersonal
                              ? 'border-warning bg-warning/5'
                              : 'border-secondary bg-secondary/5'
                            : 'border-base-300 text-base-content hover:border-secondary/50',
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          className={cn(
                            'radio self-end radio-sm radio-secondary',
                            confirmingPersonal && selected && 'radio-warning',
                          )}
                          checked={selected}
                          onChange={() => {
                            if (
                              value === true &&
                              !workspace.is_personal &&
                              nonOwnerMembersCount > 0
                            ) {
                              form.setFieldValue('is_personal', true);
                              setConfirmingPersonal(true);
                            } else {
                              setConfirmingPersonal(false);
                              field.handleChange(value);
                            }
                          }}
                          onBlur={field.handleBlur}
                        />
                        <Icon
                          size={28}
                          className={cn(
                            confirmingPersonal && selected && 'text-warning',
                          )}
                        />
                        <span className={`text-sm font-semibold`}>
                          {t(labelKey)}
                        </span>
                        <span className={`text-xs`}>{t(subtitleKey)}</span>
                      </label>
                    );
                  },
                )}
              </div>
            )}
          />

          {confirmingPersonal ? (
            <div className="alert-soft alert flex flex-col items-start gap-4 rounded-xl alert-error">
              <span className="flex gap-2">
                <AlertTriangle size={20} />
                <span className="text-sm font-semibold text-error">
                  {t(
                    'workspace.edit.makePersonalWarning.title',
                    'Passer en mode personnel ?',
                  )}
                </span>
              </span>
              <span className="text-sm text-base-content/70">
                {t(
                  'workspace.edit.makePersonalWarning.currentlyHas',
                  'Cet espace compte actuellement',
                )}{' '}
                <span className="font-semibold">
                  {nonOwnerMembersCount} {t('workspace.member', 'membre')}
                  {nonOwnerMembersCount > 1 ? 's' : ''}.
                </span>{' '}
                {t(
                  'workspace.edit.makePersonalWarning.intro',
                  'En passant en mode personnel :',
                )}
              </span>
              <ul className="list-inside list-disc space-y-1 text-sm text-base-content/70">
                <li>
                  {t(
                    'workspace.edit.makePersonalWarning.item1',
                    "Tous les membres seront retirés de l'espace",
                  )}
                </li>
                <li>
                  {t(
                    'workspace.edit.makePersonalWarning.item2',
                    'Leurs repas planifiés seront supprimés',
                  )}
                </li>
                <li>
                  {t(
                    'workspace.edit.makePersonalWarning.item3',
                    'Seul vous y aurez accès',
                  )}
                </li>
              </ul>
              <span className="flex w-full items-center gap-2 rounded-sm bg-error/10 p-3">
                <AlertTriangle size={18} />
                <span className="text-xs font-semibold">
                  {t(
                    'workspace.edit.makePersonalWarning.irreversible',
                    'Cette action est irréversible.',
                  )}
                </span>
              </span>
            </div>
          ) : (
            <span className="alert-soft alert alert-info text-xs font-normal">
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
          )}
        </>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className={cn('btn', confirmingPersonal && 'order-2')}
          onClick={() => {
            setConfirmingPersonal(false);
            closeWorkspaceEditModal();
          }}
          disabled={isWorkspaceUpdating}
        >
          {t('common.buttons.cancel', 'Annuler')}
        </button>
        <form.Subscribe>
          {(state) => (
            <button
              className={cn(
                'btn w-fit gap-2 pl-4 btn-secondary',
                confirmingPersonal && 'order-1 !btn-error',
              )}
              type="button"
              disabled={!state.canSubmit || isWorkspaceUpdating}
              onClick={() => {
                setConfirmingPersonal(false);
                form.handleSubmit();
              }}
            >
              <span>
                {confirmingPersonal
                  ? t('common.buttons.confirm', 'Confirmer')
                  : isWorkspaceUpdating
                    ? t('common.status.saving', 'Sauvegarde...')
                    : t('common.buttons.save', 'Sauvegarder')}
              </span>
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
