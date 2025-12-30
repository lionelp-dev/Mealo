import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import recipes from '@/routes/recipes';
import { Recipe } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type DeleteRecipeProps = {
  recipe: Recipe | null;
  onClose: () => void;
};

export default function DeleteRecipe({ recipe, onClose }: DeleteRecipeProps) {
  const { t } = useTranslation();

  if (!recipe) {
    return null;
  }

  const handleDelete = () => {
    router.delete(recipes.destroy.url({ id: recipe.id }));
    onClose();
  };

  return (
    <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>{t('recipes.delete.confirmTitle')}</DialogTitle>
        <DialogDescription>
          {t('recipes.delete.confirmDescription', {
            recipeName: recipe.name,
            defaultValue: `Once this recipe is deleted, it will be permanently removed. Are you sure you want to delete "${recipe.name}"?`,
          })}
        </DialogDescription>

        <DialogFooter className="w-full !justify-between">
          <button className="btn btn-error" onClick={handleDelete}>
            {t('recipes.delete.confirmButton')}{' '}
          </button>
          <DialogClose asChild>
            <button className="btn" onClick={onClose}>
              {t('recipes.delete.cancelButton')}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
