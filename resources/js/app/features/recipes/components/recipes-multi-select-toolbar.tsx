import { useRecipesContextValue } from '../inertia.adapter';
import { useDeleteRecipes } from '../repositories/use-delete-recipes';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import {
  useConfirmDialog,
  ConfirmDialog,
} from '@/app/components/confirm-dialog';
import { Trash2Icon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function RecipesMultiSelectToolbar() {
  const { t } = useTranslation();

  const { recipes } = useRecipesContextValue();
  const { deleteRecipes, processing } = useDeleteRecipes();

  const { confirm, dialogProps } = useConfirmDialog();

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipeIds,
    clearSelectedRecipes,
  } = useRecipesMultiSelectStore();

  const hasSelectedRecipesId = selectedRecipeIds.length !== 0;
  const hasMultipleSelectedRecipes = selectedRecipeIds.length > 1;
  const recipesData = recipes?.data ?? [];

  const handleCancelMultiSelect = () => {
    clearSelectedRecipes();
    setIsMultiSelectMode(false);
  };

  const handleDeleteRecipes = () => {
    const selectedRecipes = recipesData.filter((recipe) =>
      selectedRecipeIds.includes(recipe.id),
    );
    confirm({
      title: hasMultipleSelectedRecipes
        ? t(
            'recipes.delete.confirmTitleMultiple',
            'Are you sure you want to delete these recipes?',
          )
        : t(
            'recipes.delete.confirmTitle',
            'Are you sure you want to delete this recipe?',
          ),
      message: hasMultipleSelectedRecipes
        ? t('recipes.delete.confirmDescriptionMultiple', {
            count: selectedRecipes.length,
            defaultValue: `Once these ${selectedRecipes.length} recipes are deleted, they will be permanently removed. Are you sure you want to delete them?`,
          })
        : t('recipes.delete.confirmDescription', {
            recipeName: selectedRecipes[0]?.name,
            defaultValue: `Once this recipe is deleted, it will be permanently removed. Are you sure you want to delete "${selectedRecipes[0]?.name}"?`,
          }),
      submitBtnLabel: t('recipes.delete.confirmButton', 'Delete'),
      onConfirm: () => {
        deleteRecipes({ ids: selectedRecipeIds });
        clearSelectedRecipes();
        setIsMultiSelectMode(false);
      },
    });
  };

  if (!isMultiSelectMode) return null;

  return (
    <>
      <div
        className="bg-base-100"
        role="toolbar"
        aria-label={t('recipes.actions.selection', 'Recipe selection')}
      >
        <div className="flex h-16 items-center px-6">
          <button
            className="btn btn-square btn-ghost btn-sm"
            onClick={handleCancelMultiSelect}
            aria-label={t('common.buttons.close', 'Close')}
          >
            <XIcon size={22} />
          </button>
          <span className="ml-3 text-sm font-medium text-base-content">
            {selectedRecipeIds.length}{' '}
            {t(
              selectedRecipeIds.length === 1
                ? 'common.buttons.selected.singular'
                : 'common.buttons.selected.plural',
              'selected',
            )}
          </span>
          <button
            className="btn ml-auto btn-square text-base-content btn-ghost btn-sm hover:text-error"
            onClick={() => handleDeleteRecipes()}
            disabled={!hasSelectedRecipesId || processing}
            aria-label={t('common.buttons.delete', 'Delete')}
          >
            <Trash2Icon size={19} />
          </button>
        </div>
      </div>
      {dialogProps && <ConfirmDialog {...dialogProps} />}
    </>
  );
}
