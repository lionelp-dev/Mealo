import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useDeleteRecipesDialog } from '@/hooks/use-delete-recipes-dialog';

export default function DeleteRecipesDialog() {
  const { t } = useTranslation();
  
  const {
    recipesToDelete,
    isDeleteDialogOpen,
    isDeleting,
    closeDeleteDialog,
    handleDelete,
    isMultiple,
  } = useDeleteRecipesDialog();

  const getTitle = () => {
    if (isMultiple) {
      return t('recipes.delete.confirmTitleMultiple', 'Are you sure you want to delete these recipes?');
    }
    return t('recipes.delete.confirmTitle', 'Are you sure you want to delete this recipe?');
  };

  const getDescription = () => {
    if (isMultiple) {
      return t('recipes.delete.confirmDescriptionMultiple', {
        count: recipesToDelete.length,
        defaultValue: `Once these ${recipesToDelete.length} recipes are deleted, they will be permanently removed. Are you sure you want to delete them?`,
      });
    }
    return t('recipes.delete.confirmDescription', {
      recipeName: recipesToDelete[0]?.name,
      defaultValue: `Once this recipe is deleted, it will be permanently removed. Are you sure you want to delete "${recipesToDelete[0]?.name}"?`,
    });
  };

  return (
    <Dialog
      open={isDeleteDialogOpen}
      onOpenChange={(open) => !open && closeDeleteDialog()}
    >
      <DialogContent>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogDescription>{getDescription()}</DialogDescription>

        <DialogFooter className="w-full !justify-between">
          <button 
            className="btn btn-error" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('common.status.loading', 'Loading...') : t('recipes.delete.confirmButton', 'Delete')}
          </button>
          <DialogClose asChild>
            <button className="btn" onClick={closeDeleteDialog} disabled={isDeleting}>
              {t('recipes.delete.cancelButton', 'Cancel')}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
