import { useRecipeDeleteStore } from '@/stores/recipe-delete';
import { Recipe } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useMultiSelectRecipe } from './use-multi-select-recipe';

export function useDeleteRecipesDialog() {
  const store = useRecipeDeleteStore();
  const { url } = usePage();
  const { setIsMultiSelectMode, clearSelectedRecipes } = useMultiSelectRecipe();

  // Reset automatique quand l'URL change
  useEffect(() => {
    return () => {
      store.resetStore();
    };
  }, [url]);

  // Fonction utilitaire pour supprimer une seule recette
  const deleteRecipe = (recipe: Recipe) => {
    store.openDeleteDialog([recipe]);
  };

  // Fonction utilitaire pour supprimer plusieurs recettes
  const deleteRecipes = (recipes: Recipe[]) => {
    store.openDeleteDialog(recipes);
  };

  // Wrapper pour la fonction de suppression avec intégration multi-select
  const handleDelete = async () => {
    await store.deleteRecipes();

    // Fermer le mode multi-sélection après suppression réussie
    setIsMultiSelectMode(false);
    clearSelectedRecipes();
  };

  // Wrapper pour fermer le dialog avec nettoyage multi-select si nécessaire
  const handleCloseDialog = () => {
    store.closeDeleteDialog();
  };

  return {
    // État
    recipesToDelete: store.recipesToDelete,
    isDeleteDialogOpen: store.isDeleteDialogOpen,
    isDeleting: store.isDeleting,

    // Actions
    deleteRecipe,
    deleteRecipes,
    openDeleteDialog: store.openDeleteDialog,
    closeDeleteDialog: handleCloseDialog,
    handleDelete,

    // Utilitaires
    isMultiple: store.recipesToDelete.length > 1,
    isSingle: store.recipesToDelete.length === 1,
  };
}

