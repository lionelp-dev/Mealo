import { RecipeResource } from '@/app/data/resources/recipe/types';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

type DiscoveryStatus = 'idle' | 'active' | 'paused';

export type DiscoveryState = {
  status: DiscoveryStatus;
  selectedRecipeId: string | null;
  previousRecipeId: string | null;
  pendingCount: number;
  isGenerating: boolean;
  hasUnsavedChanges: boolean;
  sessionKey: number;
  recentlyAddedRecipeId: string | null;
};

export type DiscoveryProgress = Pick<
  DiscoveryState,
  'pendingCount' | 'isGenerating' | 'hasUnsavedChanges'
>;

export type DiscoveryAction =
  | { type: 'START'; previousRecipeId: string | null }
  | { type: 'RESUME' }
  | { type: 'SELECT_RECIPE'; recipeId: string }
  | { type: 'CLOSE_RECIPE' }
  | { type: 'UPDATE_PROGRESS'; progress: DiscoveryProgress }
  | { type: 'SAVE_RECIPE'; recipeId: string }
  | { type: 'QUIT'; selectedRecipeId: string | null }
  | { type: 'CLEAR_RECENTLY_ADDED_RECIPE' };

const isDesktopViewport = () =>
  typeof window === 'undefined' ||
  window.matchMedia?.('(min-width: 1024px)').matches !== false;

export function discoveryReducer(
  state: DiscoveryState,
  action: DiscoveryAction,
): DiscoveryState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        status: 'active',
        previousRecipeId: action.previousRecipeId,
      };
    case 'RESUME':
      return { ...state, status: 'active' };
    case 'SELECT_RECIPE':
      return {
        ...state,
        selectedRecipeId: action.recipeId,
        status: state.status === 'active' ? 'paused' : state.status,
      };
    case 'CLOSE_RECIPE':
      return { ...state, selectedRecipeId: null };
    case 'UPDATE_PROGRESS':
      return { ...state, ...action.progress };
    case 'SAVE_RECIPE':
      return {
        ...state,
        selectedRecipeId: action.recipeId,
        recentlyAddedRecipeId: action.recipeId,
      };
    case 'QUIT':
      return {
        ...state,
        status: 'idle',
        selectedRecipeId: action.selectedRecipeId,
        previousRecipeId: null,
        pendingCount: 0,
        isGenerating: false,
        hasUnsavedChanges: false,
        sessionKey: state.sessionKey + 1,
      };
    case 'CLEAR_RECENTLY_ADDED_RECIPE':
      return { ...state, recentlyAddedRecipeId: null };
  }
}

export function useDiscoverySession(
  recipes: RecipeResource[],
  initialRecipe?: RecipeResource | null,
) {
  const [state, dispatch] = useReducer(
    discoveryReducer,
    undefined,
    (): DiscoveryState => ({
      status: 'idle',
      selectedRecipeId: isDesktopViewport()
        ? (initialRecipe?.id ?? recipes[0]?.id ?? null)
        : null,
      previousRecipeId: null,
      pendingCount: 0,
      isGenerating: false,
      hasUnsavedChanges: false,
      sessionKey: 0,
      recentlyAddedRecipeId: null,
    }),
  );

  const isDiscovering = state.status === 'active';
  const canResume =
    state.status === 'paused' && (state.pendingCount > 0 || state.isGenerating);

  const selectedRecipe = useMemo(
    () =>
      isDiscovering
        ? null
        : state.selectedRecipeId
          ? (recipes.find((recipe) => recipe.id === state.selectedRecipeId) ??
            null)
          : null,
    [isDiscovering, recipes, state.selectedRecipeId],
  );

  useEffect(() => {
    if (!state.recentlyAddedRecipeId) return;
    const timeout = window.setTimeout(
      () => dispatch({ type: 'CLEAR_RECENTLY_ADDED_RECIPE' }),
      5000,
    );
    return () => window.clearTimeout(timeout);
  }, [state.recentlyAddedRecipeId]);

  const start = useCallback(() => {
    dispatch({ type: 'START', previousRecipeId: state.selectedRecipeId });
  }, [state.selectedRecipeId]);

  const quit = useCallback(() => {
    if (
      state.hasUnsavedChanges &&
      !window.confirm(
        'Quitter la découverte abandonnera votre demande et vos critères. Continuer ?',
      )
    ) {
      return;
    }
    dispatch({
      type: 'QUIT',
      selectedRecipeId: isDesktopViewport()
        ? (state.previousRecipeId ?? recipes[0]?.id ?? null)
        : null,
    });
  }, [recipes, state.hasUnsavedChanges, state.previousRecipeId]);

  const selectRecipe = useCallback((recipe: RecipeResource) => {
    dispatch({ type: 'SELECT_RECIPE', recipeId: recipe.id });
  }, []);

  const closeRecipe = useCallback(() => {
    dispatch({ type: 'CLOSE_RECIPE' });
  }, []);

  const saveRecipe = useCallback((recipeId: string) => {
    dispatch({ type: 'SAVE_RECIPE', recipeId });
  }, []);

  const updateProgress = useCallback((progress: DiscoveryProgress) => {
    dispatch({ type: 'UPDATE_PROGRESS', progress });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  return {
    selectedRecipe,
    isDiscovering,
    canResume,
    recentlyAddedRecipeId: state.recentlyAddedRecipeId,
    sessionKey: state.sessionKey,
    start,
    quit,
    resume,
    selectRecipe,
    closeRecipe,
    saveRecipe,
    updateProgress,
  };
}
