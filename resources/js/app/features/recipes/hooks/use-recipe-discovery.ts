import {
  type DiscoveryJobStatus,
  requestDiscoveryJob,
  saveDiscoveredRecipe,
} from '../repositories/recipe-discovery.api';
import type { DiscoveryPool, DiscoveredRecipe } from '../types/discovery';
import { useDiscoveryJob } from './use-discovery-job';
import { useEffect, useReducer, useRef } from 'react';

type UseRecipeDiscoveryOptions = { onRecipeSaved: (recipeId: string) => void };

export type RecipeDiscoveryCriteria = {
  prompt: string;
  diet: string | null;
  styles: string[];
  effort: string | null;
  mealTimes: string[];
};

type RecipeDiscoveryRequestType = 'generation' | 'prefetch';
type RecipeDiscoveryRequestStatus = 'idle' | 'submitting' | 'polling';
type RecipeDiscoveryJob = {
  id: string;
  requestType: RecipeDiscoveryRequestType;
};

type RecipeDiscoveryState = {
  pendingRecipes: DiscoveredRecipe[];
  activeJob: RecipeDiscoveryJob | null;
  requestType: RecipeDiscoveryRequestType | null;
  requestStatus: RecipeDiscoveryRequestStatus;
  isSaving: boolean;
  isRefining: boolean;
  generationError: string | null;
  prefetchError: string | null;
  saveError: string | null;
};

type RecipeDiscoveryAction =
  | { type: 'REQUEST_STARTED'; requestType: RecipeDiscoveryRequestType }
  | { type: 'JOB_RECEIVED'; job: RecipeDiscoveryJob }
  | {
      type: 'POOL_RECEIVED';
      pool: DiscoveryPool;
      requestType: RecipeDiscoveryRequestType;
    }
  | {
      type: 'REQUEST_FAILED';
      requestType: RecipeDiscoveryRequestType;
      error: string;
    }
  | { type: 'CURRENT_RECIPE_SKIPPED' }
  | { type: 'SAVE_STARTED' }
  | { type: 'SAVE_FINISHED' }
  | { type: 'SAVE_FAILED'; error: string }
  | { type: 'REFINING_CHANGED'; value: boolean };

const initialState: RecipeDiscoveryState = {
  pendingRecipes: [],
  activeJob: null,
  requestType: null,
  requestStatus: 'idle',
  isSaving: false,
  isRefining: false,
  generationError: null,
  prefetchError: null,
  saveError: null,
};

const PREFETCH_AFTER_SKIPPED_RECIPES = 3;
const SKIPPED_RECIPE_COUNT_RESET_AT = 10;

function recipeDiscoveryReducer(
  state: RecipeDiscoveryState,
  action: RecipeDiscoveryAction,
): RecipeDiscoveryState {
  switch (action.type) {
    case 'REQUEST_STARTED':
      return {
        ...state,
        requestType: action.requestType,
        requestStatus: 'submitting',
        generationError:
          action.requestType === 'generation' ? null : state.generationError,
        prefetchError:
          action.requestType === 'prefetch' ? null : state.prefetchError,
      };
    case 'JOB_RECEIVED':
      return {
        ...state,
        activeJob: action.job,
        requestType: action.job.requestType,
        requestStatus: 'polling',
      };
    case 'POOL_RECEIVED':
      return {
        ...state,
        pendingRecipes:
          action.requestType === 'prefetch'
            ? [...state.pendingRecipes, ...action.pool.recipes]
            : action.pool.recipes,
        activeJob: null,
        requestType: null,
        requestStatus: 'idle',
        isRefining:
          action.requestType === 'prefetch' ? state.isRefining : false,
      };
    case 'REQUEST_FAILED':
      return {
        ...state,
        activeJob: null,
        requestType: null,
        requestStatus: 'idle',
        generationError:
          action.requestType === 'generation'
            ? action.error
            : state.generationError,
        prefetchError:
          action.requestType === 'prefetch'
            ? action.error
            : state.prefetchError,
      };
    case 'CURRENT_RECIPE_SKIPPED':
      return { ...state, pendingRecipes: state.pendingRecipes.slice(1) };
    case 'SAVE_STARTED':
      return { ...state, isSaving: true, saveError: null };
    case 'SAVE_FINISHED':
      return { ...state, isSaving: false };
    case 'SAVE_FAILED':
      return { ...state, saveError: action.error };
    case 'REFINING_CHANGED':
      return { ...state, isRefining: action.value };
  }
}

function cloneRecipeDiscoveryCriteria(
  criteria: RecipeDiscoveryCriteria,
): RecipeDiscoveryCriteria {
  return {
    ...criteria,
    styles: [...criteria.styles],
    mealTimes: [...criteria.mealTimes],
  };
}

function shouldPrefetchRecipes(
  pendingRecipeCount: number,
  skippedRecipeCount: number,
) {
  return (
    pendingRecipeCount === 1 ||
    skippedRecipeCount === PREFETCH_AFTER_SKIPPED_RECIPES
  );
}

export function buildRecipeDiscoveryPrompt(criteria: RecipeDiscoveryCriteria) {
  const preferences = [
    ...criteria.styles,
    criteria.diet,
    criteria.effort,
  ].filter((value): value is string => value !== null);
  const customPrompt = criteria.prompt.trim();

  return customPrompt || preferences.length > 0
    ? [
        customPrompt,
        preferences.length > 0
          ? `Préférences : ${preferences.join(', ')}.`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    : 'Surprenez-moi avec une recette variée, savoureuse et de saison.';
}

export function useRecipeDiscovery({
  onRecipeSaved,
}: UseRecipeDiscoveryOptions) {
  const [state, dispatch] = useReducer(recipeDiscoveryReducer, initialState);
  const skippedRecipeCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const lastRequestedCriteriaRef = useRef<RecipeDiscoveryCriteria>({
    prompt: '',
    diet: null,
    styles: [],
    effort: null,
    mealTimes: [],
  });
  const currentRecipe = state.pendingRecipes[0] ?? null;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRecipeDiscoveryJobStatus = (status: DiscoveryJobStatus) => {
    const job = state.activeJob;
    if (!job) return;

    if (status.status === 'failed') {
      dispatch({
        type: 'REQUEST_FAILED',
        requestType: job.requestType,
        error: status.error ?? 'La génération des recettes a échoué.',
      });
      return;
    }

    if (status.status !== 'completed') return;

    if (!status.pool || status.pool.recipes.length === 0) {
      dispatch({
        type: 'REQUEST_FAILED',
        requestType: job.requestType,
        error: status.pool
          ? 'Aucune proposition n’a pu être générée. Réessayez dans quelques instants.'
          : 'Le serveur n’a retourné aucune proposition.',
      });
      return;
    }

    dispatch({
      type: 'POOL_RECEIVED',
      pool: status.pool,
      requestType: job.requestType,
    });
    if (job.requestType === 'generation') skippedRecipeCountRef.current = 0;
  };

  useDiscoveryJob(state.activeJob?.id ?? null, {
    onStatus: handleRecipeDiscoveryJobStatus,
    onError: () => {
      const job = state.activeJob;
      if (!job) return;
      dispatch({
        type: 'REQUEST_FAILED',
        requestType: job.requestType,
        error: 'Impossible de suivre la génération des recettes.',
      });
    },
  });

  const requestRecipeDiscoveryPool = (
    criteria: RecipeDiscoveryCriteria,
    requestType: RecipeDiscoveryRequestType,
  ) => {
    if (state.requestStatus !== 'idle') return;

    dispatch({ type: 'REQUEST_STARTED', requestType });
    requestDiscoveryJob(
      {
        prompt: buildRecipeDiscoveryPrompt(criteria),
        meal_times: criteria.mealTimes,
      },
      {
        onJobCreated: (id) => {
          if (isMountedRef.current) {
            dispatch({
              type: 'JOB_RECEIVED',
              job: { id, requestType },
            });
          }
        },
        onError: (error) => {
          if (isMountedRef.current) {
            dispatch({ type: 'REQUEST_FAILED', requestType, error });
          }
        },
      },
    );
  };

  const skipCurrentRecipe = () => {
    const skippedRecipeCount = skippedRecipeCountRef.current + 1;
    const shouldPrefetch = shouldPrefetchRecipes(
      state.pendingRecipes.length,
      skippedRecipeCount,
    );
    dispatch({ type: 'CURRENT_RECIPE_SKIPPED' });
    skippedRecipeCountRef.current =
      skippedRecipeCount === SKIPPED_RECIPE_COUNT_RESET_AT
        ? 0
        : skippedRecipeCount;
    if (shouldPrefetch) {
      requestRecipeDiscoveryPool(lastRequestedCriteriaRef.current, 'prefetch');
    }
  };

  const saveRecipe = () => {
    if (!currentRecipe || state.isSaving) return;
    dispatch({ type: 'SAVE_STARTED' });
    saveDiscoveredRecipe(currentRecipe, {
      onSaved: (id) => {
        if (!isMountedRef.current) return;
        onRecipeSaved(id);
        skipCurrentRecipe();
      },
      onError: (error) => {
        if (isMountedRef.current) dispatch({ type: 'SAVE_FAILED', error });
      },
      onFinish: () => {
        if (isMountedRef.current) dispatch({ type: 'SAVE_FINISHED' });
      },
    });
  };

  return {
    currentRecipe,
    pendingCount: state.pendingRecipes.length,
    isGenerating:
      state.requestStatus !== 'idle' && state.requestType === 'generation',
    isPrefetching:
      state.requestStatus !== 'idle' && state.requestType === 'prefetch',
    isSaving: state.isSaving,
    isRefining: state.isRefining,
    error: state.generationError ?? state.saveError ?? state.prefetchError,
    setIsRefining: (value: boolean) =>
      dispatch({ type: 'REFINING_CHANGED', value }),
    generateRecipes: (criteria: RecipeDiscoveryCriteria) => {
      lastRequestedCriteriaRef.current = cloneRecipeDiscoveryCriteria(criteria);
      requestRecipeDiscoveryPool(criteria, 'generation');
    },
    retryGeneration: (criteria: RecipeDiscoveryCriteria) => {
      lastRequestedCriteriaRef.current = cloneRecipeDiscoveryCriteria(criteria);
      requestRecipeDiscoveryPool(criteria, 'generation');
    },
    skipRecipe: skipCurrentRecipe,
    saveRecipe,
  };
}
