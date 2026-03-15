import { useRecipesContextValue } from '../inertia.adapter';
import { deleteRecipes } from '../repositories/recipes.repository';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import {
  useConfirmDialog,
  ConfirmDialog,
} from '@/app/components/confirm-dialog';
import { Recipe } from '@/app/entities/recipe/types';
import { useTranslation } from 'react-i18next';

export function RecipesMultiSelectToolbar() {
  const { t } = useTranslation();

  const { recipes } = useRecipesContextValue();

  const { confirm, dialogProps } = useConfirmDialog();

  const {
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedRecipeIds,
    clearSelectedRecipes,
  } = useRecipesMultiSelectStore();

  const hasSelectedRecipesId = selectedRecipeIds.length !== 0;

  const handleCancelMultiSelect = () => {
    clearSelectedRecipes();
    setIsMultiSelectMode(false);
  };

  const handleClearSelectedRecipes = () => {
    clearSelectedRecipes();
  };

  const handleDeleteRecipes = () => {
    const selectedRecipes = recipes.data.filter((recipe: Recipe) =>
      selectedRecipeIds.includes(recipe.id),
    );
    confirm({
      title: isMultiSelectMode
        ? t(
            'recipes.delete.confirmTitleMultiple',
            'Are you sure you want to delete these recipes?',
          )
        : t(
            'recipes.delete.confirmTitle',
            'Are you sure you want to delete this recipe?',
          ),
      message: isMultiSelectMode
        ? t('recipes.delete.confirmDescriptionMultiple', {
            count: selectedRecipes.length,
            defaultValue: `Once these ${selectedRecipes.length} recipes are deleted, they will be permanently removed. Are you sure you want to delete them?`,
          })
        : t('recipes.delete.confirmDescription', {
            recipeName: selectedRecipes[0]?.name,
            defaultValue: `Once this recipe is deleted, it will be permanently removed. Are you sure you want to delete "${selectedRecipes[0]?.name}"?`,
          }),
      submitBtnLabel: t('recipes.delete.confirmButton', 'Delete'),
      onConfirm: async () => {
        await deleteRecipes(selectedRecipes);
        clearSelectedRecipes();
        setIsMultiSelectMode(false);
      },
    });
  };
  return (
    <>
      <div className="fixed bottom-7 left-1/2 z-20 flex -translate-x-1/2 transform">
        <div className="join shadow-2xl">
          <button
            className="btn join-item rounded-l-full border-base-300 text-sm font-medium text-base-content"
            onClick={handleCancelMultiSelect}
            disabled={!hasSelectedRecipesId}
          >
            {t('common.buttons.abandon', 'Cancel')}
          </button>

          <button
            onClick={handleClearSelectedRecipes}
            className="btn join-item flex items-center gap-3 border-base-300 px-5"
          >
            <span className="flex items-baseline gap-1.5 text-base-content">
              <span className="mb-[1px] text-sm font-medium">
                {t('common.buttons.clearSelection', 'Clear selection')}
              </span>
              <span className="text-sm font-medium">
                ({selectedRecipeIds.length})
              </span>
            </span>
          </button>

          <button
            className="btn join-item rounded-r-full border-base-300 text-error hover:bg-base-300"
            onClick={() => handleDeleteRecipes()}
            disabled={!hasSelectedRecipesId}
          >
            {t('common.buttons.remove', 'Remove')}
          </button>
        </div>
      </div>
      {dialogProps && <ConfirmDialog {...dialogProps} />}
    </>
  );
}
