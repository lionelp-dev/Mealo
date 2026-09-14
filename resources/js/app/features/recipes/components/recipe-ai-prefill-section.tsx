import { useGenerateRecipePreview } from '../repositories/use-generate-recipe-preview';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import { recipeAIGenerateRequestSchema } from '@/app/data/requests/recipe/schemas/recipe-ai-generate.request.schema';
import { useAppForm } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { AlertTriangle, Wand2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onPrefillSuccess?: () => void;
};

export function RecipeAIPrefillSection({ onPrefillSuccess }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { generateRecipePreview, processing } = useGenerateRecipePreview();

  const form = useAppForm({
    defaultValues: {
      prompt: '',
    },
    validators: {
      onSubmit: recipeAIGenerateRequestSchema.pick({ prompt: true }),
    },
    onSubmit: ({ value }) => {
      generateRecipePreview(value.prompt, {
        onSuccess: () => {
          setIsOpen(false);
          onPrefillSuccess?.();
        },
      });
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const animationFrame = window.requestAnimationFrame(() => {
      promptTextareaRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isOpen]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="order-0 flex w-full max-w-full min-w-0 flex-col gap-3 lg:order-none"
    >
      <div
        className="flex min-h-14 w-full max-w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-xl border border-dashed border-secondary/35 bg-base-100 px-4 py-3 transition-colors hover:bg-secondary/5 sm:min-h-16 sm:gap-4 sm:px-5"
        onClick={() => setIsOpen((open) => !open)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Wand2 className="h-5 w-5 shrink-0 text-secondary" />
          <h2 className="min-w-0 flex-1 truncate text-base font-bold text-secondary sm:text-lg">
            {t('recipes.prefill.title', 'Préremplir une recette avec l’IA')}
          </h2>
        </div>

        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="btn min-w-0 shrink-0 px-2 text-sm font-medium text-base-content/45 btn-ghost btn-sm hover:bg-transparent hover:text-base-content/70"
            onClick={(event) => event.stopPropagation()}
          >
            {isOpen
              ? t('recipes.prefill.hide', 'Masquer')
              : t('recipes.prefill.show', 'Afficher')}
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="flex w-full max-w-full min-w-0 flex-col gap-4 rounded-xl border border-base-300/30 bg-base-100 p-4 py-6 shadow-xs sm:p-7 sm:py-6.5">
          <p className="min-w-0 text-sm leading-6 break-words text-base-content/65 sm:text-base">
            {t(
              'recipes.prefill.description',
              'Indiquez un nom, décrivez un plat ou collez une recette complète.',
            )}
          </p>

          <form.AppField
            name="prompt"
            validators={{
              onChange: recipeAIGenerateRequestSchema.shape.prompt,
              onBlur: recipeAIGenerateRequestSchema.shape.prompt,
            }}
            children={(field) => {
              const shouldShowErrors =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const translatedPromptErrors = [
                ...new Set(
                  field.state.meta.errors.flatMap((error) =>
                    error?.message ? [error.message] : [],
                  ),
                ),
              ].map((error) => t(error, error));

              return (
                <>
                  <textarea
                    ref={promptTextareaRef}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    rows={5}
                    disabled={processing}
                    className={cn(
                      'textarea min-h-28 w-full min-w-0 resize-y rounded-2xl border-base-300 bg-base-100 px-4 py-4 text-base placeholder:text-base-content/35 focus:border-secondary focus:outline-none',
                      shouldShowErrors && 'textarea-error',
                    )}
                    placeholder={t(
                      'recipes.prefill.placeholder',
                      'Ex. Curry de poulet ou plat végétarien rapide pour 4 personnes...',
                    )}
                  />

                  {shouldShowErrors && (
                    <em className="flex min-w-0 items-center gap-2 text-sm text-error">
                      <AlertTriangle size={14} className="flex-shrink-0" />
                      <span className="min-w-0 break-words">
                        {translatedPromptErrors.join(', ')}
                      </span>
                    </em>
                  )}
                </>
              );
            }}
          />

          <div className="flex min-w-0 justify-start">
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                prompt: state.values.prompt,
              })}
            >
              {({ canSubmit, prompt }) => (
                <button
                  type="button"
                  disabled={
                    processing || !canSubmit || prompt.trim().length < 5
                  }
                  className="btn w-full max-w-full min-w-0 whitespace-normal btn-secondary sm:w-fit"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  {processing ? (
                    <span className="loading loading-xs loading-spinner" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {processing ? (
                    <span className="min-w-0 truncate">
                      {t('recipes.prefill.generating', 'Pré-remplissage...')}
                    </span>
                  ) : (
                    <span className="min-w-0 truncate">
                      {t('recipes.prefill.button', 'Analyser et préremplir')}
                    </span>
                  )}
                </button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
