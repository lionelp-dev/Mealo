import { DiscoveryPool, DiscoveredRecipe } from '../types/discovery';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onSaved: (recipeId: string) => void;
  onPendingChange: (count: number) => void;
  onGeneratingChange: (value: boolean) => void;
  onPreparationChange: (value: boolean) => void;
};

type DiscoveryJob = {
  id: string;
  prefetch: boolean;
};

type DiscoveryJobStatus = {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  pool?: DiscoveryPool;
  error?: string;
};

export function useRecipeDiscovery({
  onSaved,
  onPendingChange,
  onGeneratingChange,
  onPreparationChange,
}: Props) {
  const [prompt, setPrompt] = useState('');
  const [maxDuration, setMaxDuration] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<DiscoveredRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [discoveryJob, setDiscoveryJob] = useState<DiscoveryJob | null>(null);
  const swipes = useRef(0);
  const requestInFlight = useRef(false);
  const currentRecipe = recipes[0] ?? null;

  useEffect(
    () => onPendingChange(recipes.length),
    [onPendingChange, recipes.length],
  );

  useEffect(() => {
    if (!discoveryJob) return;

    let cancelled = false;
    let nextPoll: number | undefined;

    const finish = () => {
      requestInFlight.current = false;
      setDiscoveryJob(null);
      setIsGenerating(false);
      setIsPrefetching(false);
    };

    const poll = async () => {
      try {
        const response = await fetch(
          `/recipes/discover/status/${discoveryJob.id}`,
          { headers: { Accept: 'application/json' } },
        );

        if (!response.ok) {
          throw new Error('Unable to retrieve the recipe discovery status.');
        }

        const status = (await response.json()) as DiscoveryJobStatus;

        if (cancelled) return;

        if (status.status === 'queued' || status.status === 'processing') {
          nextPoll = window.setTimeout(poll, 1500);
          return;
        }

        if (status.status === 'failed') {
          setError(status.error ?? 'La génération des recettes a échoué.');
          finish();
          return;
        }

        const pool = status.pool;
        if (!pool) {
          setError('Le serveur n’a retourné aucune proposition.');
          finish();
          return;
        }

        if (pool.recipes.length === 0) {
          setError(
            'Aucune proposition n’a pu être générée. Réessayez dans quelques instants.',
          );
          finish();
          return;
        }

        setRecipes((current) =>
          discoveryJob.prefetch ? [...current, ...pool.recipes] : pool.recipes,
        );
        if (!discoveryJob.prefetch) {
          swipes.current = 0;
          setIsRefining(false);
        }
        if (pool.failedRecipeCount) {
          setNotice(
            `${pool.failedRecipeCount} proposition(s) n’ont pas pu être générées.`,
          );
        }
        finish();
      } catch {
        if (!cancelled) {
          setError('Impossible de suivre la génération des recettes.');
          finish();
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (nextPoll !== undefined) window.clearTimeout(nextPoll);
    };
  }, [discoveryJob]);
  useEffect(
    () => onGeneratingChange(isGenerating || isPrefetching),
    [isGenerating, isPrefetching, onGeneratingChange],
  );
  useEffect(
    () =>
      onPreparationChange(
        prompt.trim().length > 0 ||
          maxDuration !== null ||
          diet !== null ||
          style !== null,
      ),
    [diet, maxDuration, onPreparationChange, prompt, style],
  );

  const replacePreference = (
    kind: 'duration' | 'diet' | 'style',
    previous: string | null,
    next: string | null,
  ) => {
    const phrase = (value: string | null) => {
      if (!value || (kind === 'duration' && value === 'Peu importe')) {
        return null;
      }
      return kind === 'duration'
        ? `à préparer en moins de ${value}`
        : value.toLowerCase();
    };
    setPrompt((value) => {
      const parts = value
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part && part !== phrase(previous));
      if (phrase(next)) parts.push(phrase(next)!);
      return parts.join(', ');
    });
  };

  const selectDuration = (value: string) => {
    const next = maxDuration === value ? null : value;
    replacePreference('duration', maxDuration, next);
    setMaxDuration(next);
  };
  const selectDiet = (value: string) => {
    const next = diet === value ? null : value;
    replacePreference('diet', diet, next);
    setDiet(next);
  };
  const selectStyle = (value: string) => {
    const next = style === value ? null : value;
    replacePreference('style', style, next);
    setStyle(next);
  };

  const requestPool = (prefetch: boolean) => {
    if (!prompt.trim() || requestInFlight.current) return;
    requestInFlight.current = true;
    setError(null);
    if (prefetch) {
      setIsPrefetching(true);
    } else {
      setIsGenerating(true);
    }
    router.post(
      '/recipes/discover/pool',
      { prompt: prompt.trim() },
      {
        async: true,
        preserveUrl: true,
        preserveState: true,
        preserveScroll: true,
        only: ['discovery_job', 'discovery_error'],
        onSuccess: (page) => {
          const discoveryError = page.props.discovery_error;
          if (typeof discoveryError === 'string') {
            setError(discoveryError);
            requestInFlight.current = false;
            setIsGenerating(false);
            setIsPrefetching(false);
            return;
          }
          const job = page.props.discovery_job as { id?: unknown } | undefined;
          if (!job || typeof job.id !== 'string') {
            setError('Le serveur n’a pas démarré la génération.');
            requestInFlight.current = false;
            setIsGenerating(false);
            setIsPrefetching(false);
            return;
          }
          setDiscoveryJob({ id: job.id, prefetch });
        },
        onError: () => {
          setError('La génération des recettes a échoué.');
          requestInFlight.current = false;
          setIsGenerating(false);
          setIsPrefetching(false);
        },
      },
    );
  };

  const advance = () => {
    const isLast = recipes.length === 1;
    setRecipes((current) => current.slice(1));
    const nextCount = swipes.current + 1;
    if (nextCount === 5 || isLast) requestPool(true);
    swipes.current = nextCount === 10 ? 0 : nextCount;
  };

  const save = () => {
    if (!currentRecipe || isSaving) return;
    setIsSaving(true);
    const { image_generation_failed, ...recipe } = currentRecipe;
    void image_generation_failed;
    router.post(
      '/recipes/discover/save',
      { ...recipe, image: null },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['recipes', 'selected_recipe', 'discovery_error'],
        onSuccess: (page) => {
          const discoveryError = page.props.discovery_error;
          if (typeof discoveryError === 'string') {
            setError(discoveryError);
            return;
          }
          const selectedRecipe = page.props.selected_recipe as
            | { id?: string }
            | null
            | undefined;
          const id = selectedRecipe?.id;
          if (typeof id !== 'string') {
            setError(
              'Le serveur n’a pas confirmé l’enregistrement de la recette.',
            );
            return;
          }
          onSaved(id);
          advance();
        },
        onError: () => setError('La recette n’a pas pu être sauvegardée.'),
        onFinish: () => setIsSaving(false),
      },
    );
  };

  return {
    currentRecipe,
    prompt,
    maxDuration,
    diet,
    style,
    isGenerating,
    isPrefetching,
    isSaving,
    isRefining,
    error,
    notice,
    setPrompt,
    setIsRefining,
    selectDuration,
    selectDiet,
    selectStyle,
    generate: () => {
      setNotice(null);
      requestPool(false);
    },
    retry: () => requestPool(true),
    skip: advance,
    save,
  };
}
