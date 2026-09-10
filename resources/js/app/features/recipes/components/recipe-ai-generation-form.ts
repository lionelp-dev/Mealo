import type { RecipeAIGenerateRequest } from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';

export type GenerationMode = 'single' | 'multiple';

export const defaultRecipeGenerationValues: RecipeAIGenerateRequest = {
  prompt: '',
  context: {
    meal_time: null,
    meal_times: [],
    count: 1,
  },
  image_generation: false,
};

export function getSelectedPrompts(prompt: string): string[] {
  return prompt.split('\n').filter(Boolean);
}

export function buildRecipeGenerationPayload(
  value: RecipeAIGenerateRequest,
  mode: GenerationMode,
): RecipeAIGenerateRequest {
  return {
    ...value,
    context: {
      ...value.context,
      count: mode === 'single' ? 1 : value.context.count,
      meal_time: mode === 'single' ? null : value.context.meal_time,
      meal_times: [],
    },
  };
}

export function isSubmitDisabled(
  value: RecipeAIGenerateRequest,
  mode: GenerationMode,
): boolean {
  if (mode === 'single') {
    return value.prompt.trim().length < 5;
  }

  return value.context.meal_time === null;
}

export function togglePromptPreset(prompt: string, preset: string): string {
  const prompts = getSelectedPrompts(prompt);

  if (prompts.includes(preset)) {
    return prompts
      .filter((selectedPrompt) => selectedPrompt !== preset)
      .join('\n');
  }

  return [...prompts, preset].join('\n');
}
