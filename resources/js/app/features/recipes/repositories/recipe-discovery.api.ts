import type { DiscoveryPool, DiscoveredRecipe } from '../types/discovery';
import discover from '@/routes/recipes/discover';
import { router } from '@inertiajs/react';
import { z } from 'zod';

export type DiscoveryJobStatus =
  | { status: 'queued' | 'processing' }
  | { status: 'completed'; pool?: DiscoveryPool }
  | { status: 'failed'; error?: string };

type DiscoveryPageProps = {
  discovery_error?: string;
  discovery_job?: { id?: string };
  selected_recipe?: { id?: string } | null;
};

type DiscoveryPayload = { prompt: string; meal_times: string[] };

const discoveryJobSchema = z.object({ id: z.string() });
const selectedRecipeSchema = z.object({ id: z.string() });

const discoveryPoolSchema: z.ZodType<DiscoveryPool> = z.object({
  recipes: z.array(z.custom<DiscoveredRecipe>()),
  failedRecipeCount: z.number().int().nonnegative(),
});

const discoveryJobStatusSchema: z.ZodType<DiscoveryJobStatus> =
  z.discriminatedUnion('status', [
    z.object({ status: z.enum(['queued', 'processing']) }),
    z.object({
      status: z.literal('completed'),
      pool: discoveryPoolSchema.optional(),
    }),
    z.object({ status: z.literal('failed'), error: z.string().optional() }),
  ]);

function pageProps(page: { props: unknown }): DiscoveryPageProps {
  if (!page.props || typeof page.props !== 'object') return {};

  const props = page.props as Record<string, unknown>;
  const discoveryJob = discoveryJobSchema.safeParse(props.discovery_job);
  const selectedRecipe = selectedRecipeSchema.safeParse(props.selected_recipe);

  return {
    discovery_error:
      typeof props.discovery_error === 'string'
        ? props.discovery_error
        : undefined,
    discovery_job: discoveryJob.success ? discoveryJob.data : undefined,
    selected_recipe:
      props.selected_recipe === null
        ? null
        : selectedRecipe.success
          ? selectedRecipe.data
          : undefined,
  };
}

function parseDiscoveryJobStatus(payload: unknown): DiscoveryJobStatus {
  const result = discoveryJobStatusSchema.safeParse(payload);

  if (!result.success) {
    throw new Error('Invalid recipe discovery status.');
  }

  return result.data;
}

export function requestDiscoveryJob(
  payload: DiscoveryPayload,
  callbacks: {
    onJobCreated: (jobId: string) => void;
    onError: (message: string) => void;
  },
) {
  router.post(discover.pool.url(), payload, {
    async: true,
    preserveUrl: true,
    preserveState: true,
    preserveScroll: true,
    only: ['discovery_job', 'discovery_error'],
    onSuccess: (page) => {
      const props = pageProps(page);
      if (typeof props.discovery_error === 'string') {
        callbacks.onError(props.discovery_error);
        return;
      }
      if (typeof props.discovery_job?.id !== 'string') {
        callbacks.onError('Le serveur n’a pas démarré la génération.');
        return;
      }
      callbacks.onJobCreated(props.discovery_job.id);
    },
    onError: () => callbacks.onError('La génération des recettes a échoué.'),
  });
}

export async function fetchDiscoveryJobStatus(
  jobId: string,
  signal: AbortSignal,
): Promise<DiscoveryJobStatus> {
  const response = await fetch(discover.status.url(jobId), {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok)
    throw new Error('Unable to retrieve the recipe discovery status.');
  return parseDiscoveryJobStatus(await response.json());
}

export function saveDiscoveredRecipe(
  recipe: DiscoveredRecipe,
  callbacks: {
    onSaved: (recipeId: string) => void;
    onError: (message: string) => void;
    onFinish: () => void;
  },
) {
  const { image_generation_failed, ...recipeToSave } = recipe;
  void image_generation_failed;

  router.post(
    discover.save.url(),
    { ...recipeToSave, image: null },
    {
      preserveState: true,
      preserveScroll: true,
      only: ['recipes', 'selected_recipe', 'discovery_error'],
      reset: ['recipes'],
      onSuccess: (page) => {
        const props = pageProps(page);
        if (typeof props.discovery_error === 'string') {
          callbacks.onError(props.discovery_error);
          return;
        }
        if (typeof props.selected_recipe?.id !== 'string') {
          callbacks.onError(
            'Le serveur n’a pas confirmé l’enregistrement de la recette.',
          );
          return;
        }
        callbacks.onSaved(props.selected_recipe.id);
      },
      onError: () =>
        callbacks.onError('La recette n’a pas pu être sauvegardée.'),
      onFinish: callbacks.onFinish,
    },
  );
}
