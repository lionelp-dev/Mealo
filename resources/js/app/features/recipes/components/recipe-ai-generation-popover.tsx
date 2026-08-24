import { useGenerateRecipes } from '../repositories/use-generate-recipes';
import {
  RECIPE_GENERATION_COUNT_OPTIONS,
  RECIPE_PROMPT_PRESETS,
  recipeAIGenerateRequestSchema,
} from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import { cn } from '@/app/lib';
import * as Popover from '@radix-ui/react-popover';
import { useForm } from '@tanstack/react-form';
import { ClassValue } from 'clsx';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  meal_times: MealTimeResource[];
  className?: ClassValue;
};

export function RecipeAIGenerationPopover({ meal_times, className }: Props) {
  const { t } = useTranslation();
  const { generateRecipes, processing } = useGenerateRecipes();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      prompt: '',
      context: {
        meal_time: null as string | null,
        count: 1 as number,
      },
      image_generation: false,
    },
    validators: {
      onSubmit: recipeAIGenerateRequestSchema,
    },
    onSubmit: ({ value }) => {
      generateRecipes(value);
      setIsOpen(false);
      form.reset();
    },
  });

  return (
    <>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              'btn gap-2 pl-5.5 btn-outline btn-secondary',
              className,
            )}
          >
            {t('recipes.generate.triggerButton', 'Générer avec l’IA')}
            <Wand2 size={15} />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 w-[22rem] rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg"
            align="end"
            sideOffset={8}
            onPointerLeave={(event) => {
              if (event.pointerType !== 'mouse') return;
              if (processing) return;

              setIsOpen(false);
              form.reset();
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 text-secondary">
                <Wand2 className="h-5 w-5" />
                <span className="font-semibold tracking-tight">
                  {t('recipes.generate.title', 'Générer des recettes')}
                </span>
              </div>

              {/* Prompt presets */}
              <form.Field
                name="prompt"
                children={(field) => (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      {t('recipes.generate.presets.label', 'Type de recettes')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {RECIPE_PROMPT_PRESETS.map((preset) => {
                        const presetPrompt = t(
                          preset.promptKey,
                          preset.promptFallback,
                        );
                        const isActive = field.state.value === presetPrompt;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            className={`btn btn-sm ${
                              isActive
                                ? 'btn-secondary'
                                : 'btn-outline btn-secondary'
                            }`}
                            onClick={() =>
                              field.handleChange(isActive ? '' : presetPrompt)
                            }
                            disabled={processing}
                          >
                            {t(preset.labelKey, preset.labelFallback)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              />

              {/* Meal time chips */}
              {meal_times.length > 0 && (
                <form.Field
                  name="context.meal_time"
                  children={(field) => (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium">
                        {t(
                          'recipes.generate.mealTime.label',
                          'Moment du repas',
                        )}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {meal_times.map((mealTime) => {
                          const isActive = field.state.value === mealTime.name;
                          return (
                            <button
                              key={mealTime.id}
                              type="button"
                              className={`btn btn-sm ${
                                isActive
                                  ? 'btn-secondary'
                                  : 'btn-outline btn-secondary'
                              }`}
                              onClick={() =>
                                field.handleChange(
                                  isActive ? null : mealTime.name,
                                )
                              }
                              disabled={processing}
                            >
                              {mealTime.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                />
              )}

              {/* Count presets */}
              <form.Field
                name="context.count"
                children={(field) => (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">
                      {t('recipes.generate.count.label', 'Nombre de recettes')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {RECIPE_GENERATION_COUNT_OPTIONS.map((count) => {
                        const isActive = field.state.value === count;
                        return (
                          <button
                            key={count}
                            type="button"
                            className={`btn w-12 btn-sm ${
                              isActive
                                ? 'btn-secondary'
                                : 'btn-outline btn-secondary'
                            }`}
                            onClick={() => field.handleChange(count)}
                            disabled={processing}
                          >
                            {count}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              />

              {/* Image generation toggle */}
              <div className="flex items-center justify-between border-t border-base-300/50 pt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {t(
                      'recipes.generate.imageGeneration.label',
                      'Générer une image',
                    )}
                  </span>
                  <p className="text-xs text-base-content/60">
                    {t(
                      'recipes.generate.imageGeneration.description',
                      'Peut prendre plus de temps',
                    )}
                  </p>
                </div>
                <form.Field
                  name="image_generation"
                  children={(field) => (
                    <input
                      type="checkbox"
                      className="toggle toggle-secondary"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      disabled={processing}
                    />
                  )}
                />
              </div>

              <button
                type="submit"
                className="btn gap-2 btn-secondary"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="loading loading-sm loading-spinner"></span>
                    {t('recipes.generate.generating', 'Génération…')}
                  </>
                ) : (
                  <>
                    {t('recipes.generate.submit', 'Générer')}
                    <Wand2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {processing && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/30 text-white backdrop-blur-xs">
          <span className="loading loading-xl loading-spinner"></span>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">
              {t(
                'recipes.generate.overlayTitle',
                'Génération de vos recettes en cours',
              )}
            </p>
            <p className="text text-white/60">
              {t(
                'mealPlanning.estimatedTime',
                'Cela peut prendre quelques instants',
              )}{' '}
              <span className="loading loading-xs loading-dots"></span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
