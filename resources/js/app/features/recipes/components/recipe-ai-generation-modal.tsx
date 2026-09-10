import { useGenerateRecipes } from '../repositories/use-generate-recipes';
import {
  buildRecipeGenerationPayload,
  defaultRecipeGenerationValues,
  getSelectedPrompts,
  isSubmitDisabled,
  togglePromptPreset,
  type GenerationMode,
} from './recipe-ai-generation-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  RECIPE_GENERATION_COUNT_OPTIONS,
  RECIPE_PROMPT_PRESETS,
  recipeAIGenerateRequestSchema,
} from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import { useAppForm } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib';
import { ClassValue } from 'clsx';
import { ImageIcon, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  meal_times: MealTimeResource[];
  className?: ClassValue;
};

const MULTIPLE_RECIPE_COUNT_OPTIONS = RECIPE_GENERATION_COUNT_OPTIONS.filter(
  (count) => count !== 1,
);

type RecipeGenerationForm = ReturnType<
  typeof useRecipeAIGenerationModal
>['form'];

function getCompactMealTimeLabel(
  mealTime: MealTimeResource,
  t: ReturnType<typeof useTranslation>['t'],
): string {
  const compactKey =
    mealTime.slug === 'diner'
      ? 'mealPlanning.dialog.filters.dinnerCompact'
      : `mealPlanning.dialog.filters.${mealTime.slug}Compact`;

  return t(compactKey, mealTime.name);
}

function useRecipeAIGenerationModal() {
  const { generateRecipes, processing, wasSuccessful, resetSuccess } =
    useGenerateRecipes();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<GenerationMode>('single');

  const form = useAppForm({
    defaultValues: defaultRecipeGenerationValues,
    validators: {
      onSubmit: recipeAIGenerateRequestSchema,
    },
    onSubmit: ({ value }) => {
      generateRecipes(buildRecipeGenerationPayload(value, mode));
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setMode('single');
  }, [form]);

  const handleSubmitSuccess = useCallback(() => {
    setOpen(false);
    resetForm();
    resetSuccess();
  }, [resetForm, resetSuccess]);

  useEffect(() => {
    if (!wasSuccessful) return;

    handleSubmitSuccess();
  }, [handleSubmitSuccess, wasSuccessful]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen && !processing) {
        resetForm();
      }
    },
    [processing, resetForm],
  );

  return {
    open,
    mode,
    setMode,
    form,
    processing,
    handleOpenChange,
    handleSubmitSuccess,
  };
}

export default function RecipeAIGenerationModal({
  meal_times,
  className,
}: Props) {
  const { t } = useTranslation();
  const { open, mode, setMode, form, processing, handleOpenChange } =
    useRecipeAIGenerationModal();
  const modalTitle =
    mode === 'single'
      ? t('recipes.generate.modalTitleSingle', 'Générer une recette')
      : t('recipes.generate.modalTitleMultiple', 'Générer plusieurs recettes');

  const recipeTypeChips = useMemo(
    () =>
      RECIPE_PROMPT_PRESETS.map((preset) => ({
        id: preset.id,
        label: t(preset.labelKey, preset.labelFallback),
        prompt: t(preset.promptKey, preset.promptFallback),
      })),
    [t],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            className={cn(
              'btn gap-2 btn-secondary max-md:btn-sm min-md:pl-5.5',
              className,
            )}
          >
            {t('recipes.generate.triggerButton', 'Générer avec l’IA')}
            <Wand2 className="h-4 w-auto max-md:hidden" />
          </button>
        </DialogTrigger>

        <DialogContent className="top-[10vh] max-h-[calc(100dvh-2rem)] translate-y-0 gap-2 overflow-y-auto rounded-2xl border-base-300 bg-base-100 p-5 shadow-2xl sm:top-[15vh] sm:max-w-2xl sm:p-7">
          <DialogHeader className="gap-1 pr-8">
            <DialogTitle className="flex items-center gap-2 text-secondary md:text-2xl">
              <Wand2 className="h-5 w-5" />
              {modalTitle}
            </DialogTitle>
            <DialogDescription className="text-left text-base-content/60">
              {t(
                'recipes.generate.modalDescription',
                'Décrivez une idée précise ou laissez l’IA proposer plusieurs recettes adaptées à vos repas.',
              )}
            </DialogDescription>
          </DialogHeader>

          <GenerationModeTabs
            form={form}
            mode={mode}
            setMode={setMode}
            processing={processing}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-2.75"
          >
            {mode === 'single' ? (
              <SingleRecipeFields form={form} processing={processing} />
            ) : (
              <MultipleRecipesFields
                form={form}
                mealTimes={meal_times}
                recipeTypeChips={recipeTypeChips}
                processing={processing}
              />
            )}

            <ImageGenerationToggle
              form={form}
              mode={mode}
              processing={processing}
            />

            <SubmitButton form={form} mode={mode} processing={processing} />
          </form>
        </DialogContent>
      </Dialog>

      <GenerationOverlay processing={processing} />
    </>
  );
}

function GenerationModeTabs({
  form,
  mode,
  setMode,
  processing,
}: {
  form: RecipeGenerationForm;
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  processing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="join flex w-full">
      <button
        type="button"
        className={cn(
          'btn join-item flex-1 btn-sm md:btn-md',
          mode === 'single' && 'btn-secondary',
        )}
        onClick={() => {
          setMode('single');
          form.setFieldValue('context.count', 1);
        }}
        disabled={processing}
      >
        {t('recipes.generate.tabs.single', 'Une recette')}
      </button>
      <button
        type="button"
        className={cn(
          'btn join-item flex-1 btn-sm md:btn-md',
          mode === 'multiple' && 'btn-secondary',
        )}
        onClick={() => {
          setMode('multiple');
          form.setFieldValue('context.count', 3);
        }}
        disabled={processing}
      >
        {t('recipes.generate.tabs.multiple', 'Plusieurs recettes')}
      </button>
    </div>
  );
}

function SingleRecipeFields({
  form,
  processing,
}: {
  form: RecipeGenerationForm;
  processing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <div>
        <h3 className="text-xs font-bold tracking-wide text-base-content/50 uppercase">
          {t('recipes.generate.single.title', 'Votre idée')}
        </h3>
      </div>
      <form.Field
        name="prompt"
        children={(field) => (
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-base-content/80">
              {t(
                'recipes.generate.single.promptLabel',
                'Que souhaitez-vous cuisiner ?',
              )}
            </span>
            <textarea
              className="textarea-bordered textarea min-h-50 w-full resize-none rounded-xl bg-base-100 p-4 text-sm leading-relaxed"
              placeholder={t(
                'recipes.generate.prompt.placeholder',
                'Ex: Un plat végétarien avec des courgettes et du fromage frais',
              )}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={processing}
              rows={6}
            />
          </label>
        )}
      />
    </div>
  );
}

function MultipleRecipesFields({
  form,
  mealTimes,
  recipeTypeChips,
  processing,
}: {
  form: RecipeGenerationForm;
  mealTimes: MealTimeResource[];
  recipeTypeChips: Array<{ id: string; label: string; prompt: string }>;
  processing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 md:gap-5">
      <div>
        <h3 className="text-xs font-bold tracking-wide text-base-content/50 uppercase">
          {t('recipes.generate.multiple.title', 'Vos préférences')}
        </h3>
      </div>

      <form.Field
        name="prompt"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-base-content/80">
              {t('recipes.generate.presets.label', 'Types de recettes')}
            </span>
            <div className="flex flex-wrap gap-2">
              {recipeTypeChips.map((preset) => {
                const prompts = getSelectedPrompts(field.state.value);
                const isActive = prompts.includes(preset.prompt);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={cn(
                      'btn px-4 text-xs font-medium btn-sm md:text-sm md:btn-md',
                      isActive ? 'btn-secondary' : 'btn-soft',
                    )}
                    onClick={() => {
                      field.handleChange(
                        togglePromptPreset(field.state.value, preset.prompt),
                      );
                    }}
                    disabled={processing}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />

      {mealTimes.length > 0 && (
        <form.Field
          name="context.meal_time"
          children={(field) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-base-content/80">
                {t(
                  'recipes.generate.mealTime.multipleLabel',
                  'Moments du repas',
                )}
              </span>
              <div className="flex flex-wrap gap-2">
                {mealTimes.map((mealTime) => {
                  const isActive = field.state.value === mealTime.slug;
                  return (
                    <button
                      key={mealTime.id}
                      type="button"
                      className={cn(
                        'btn px-4 text-xs font-medium btn-sm md:text-sm md:btn-md',
                        isActive ? 'btn-secondary' : 'btn-soft',
                      )}
                      onClick={() => {
                        field.handleChange(mealTime.slug);
                      }}
                      disabled={processing}
                    >
                      {getCompactMealTimeLabel(mealTime, t)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        />
      )}

      <form.Field
        name="context.count"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-base-content/80">
              {t('recipes.generate.count.label', 'Nombre de recettes')}
            </span>
            <div className="flex gap-2">
              {MULTIPLE_RECIPE_COUNT_OPTIONS.map((count) => {
                const isActive = field.state.value === count;

                return (
                  <button
                    key={count}
                    type="button"
                    className={cn(
                      'btn px-4 text-xs font-medium btn-sm md:text-sm md:btn-md',
                      isActive ? 'btn-secondary' : 'btn-soft',
                    )}
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
    </div>
  );
}

function ImageGenerationToggle({
  form,
  mode,
  processing,
}: {
  form: RecipeGenerationForm;
  mode: GenerationMode;
  processing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-base-300 p-3 text-sm font-medium hover:border-blue-600/80 hover:bg-blue-600/10">
      <span className="flex min-w-0 items-start gap-3.25">
        <ImageIcon className="h-8 w-8 shrink-0 text-secondary md:h-10 md:w-10" />
        <span className="flex min-w-0 flex-col gap-1 leading-4.25">
          {mode === 'single' ? (
            t('recipes.generate.imageGeneration.label', 'Générer une image')
          ) : (
            <span>
              {t(
                'recipes.generate.imageGeneration.multipleLabel',
                'Générer une image pour chaque recette',
              )}
            </span>
          )}
          <p className="text-xs text-base-content/60">
            {t(
              'recipes.generate.imageGeneration.description',
              'Peut prendre plus de temps',
            )}
          </p>
        </span>
      </span>
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
    </label>
  );
}

function SubmitButton({
  form,
  mode,
  processing,
}: {
  form: RecipeGenerationForm;
  mode: GenerationMode;
  processing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <form.Subscribe selector={(state) => state.values}>
        {(value) => (
          <button
            type="submit"
            className="btn w-full gap-2 btn-secondary"
            disabled={processing || isSubmitDisabled(value, mode)}
          >
            {processing ? (
              <>
                <span className="loading loading-sm loading-spinner"></span>
                {t('recipes.generate.generating', 'Génération en cours...')}
              </>
            ) : (
              <>
                {mode === 'single'
                  ? t('recipes.generate.submitSingle', 'Générer la recette')
                  : t(
                      'recipes.generate.submitMultiple',
                      'Générer {{count}} recettes',
                      {
                        count: value.context.count,
                      },
                    )}
                <Wand2 className="mt-0.5 h-4 w-4" />
              </>
            )}
          </button>
        )}
      </form.Subscribe>
    </div>
  );
}

function GenerationOverlay({ processing }: { processing: boolean }) {
  const { t } = useTranslation();

  if (!processing) return null;

  return (
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
  );
}
