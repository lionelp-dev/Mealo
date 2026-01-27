import { useAppForm } from '@/hooks/form-hook';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { workspaceCreationStore } from '@/stores/workspace-creation-modal-store';
import { CreateWorkspace } from '@/types';
import { t } from 'i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

export default function WorkspaceCreationModal() {
  const {
    isWorkspaceCreationModalOpen,
    isWorkspaceCreating,
    setWorkspaceCreating,
    closeWorkspaceCreationModal,
  } = workspaceCreationStore();

  const { handleCreateWorkspace } = useWorkspaces();

  const defaultValues: CreateWorkspace = {
    name: '',
    description: '',
  };

  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      handleCreateWorkspace(value, {
        onStart: () => setWorkspaceCreating(true),
        onSuccess: () => {
          closeWorkspaceCreationModal();
          setWorkspaceCreating(false);
        },
        onError: (error) => {
          console.error('Failed to create workspace:', error);
          setWorkspaceCreating(false);
        },
      });
    },
  });

  return (
    <Dialog
      open={isWorkspaceCreationModalOpen}
      onOpenChange={closeWorkspaceCreationModal}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t('workspace.createNew', 'Créer un espace')}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label={t('workspace.name', 'Nom')} />
            )}
          />
          <form.AppField
            name="description"
            children={(field) => (
              <field.TextField
                label={
                  t('workspace.description', 'Description') +
                  ' ' +
                  t('common.optional', '(optionnel)')
                }
              />
            )}
          />
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
                    {isWorkspaceCreating
                      ? t('common.loading', 'Création...')
                      : t('common.buttons.create', 'Créer')}
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
