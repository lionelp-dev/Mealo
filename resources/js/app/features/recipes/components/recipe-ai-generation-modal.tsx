import { useRecipesContextValue } from '../inertia.adapter';
import { useGenerateRecipe } from '../repositories/use-generate-recipe';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { recipeAIGenerationRequestSchema } from '@/app/data/requests/recipe/schemas/recipe-ai-generation.request.schema';
import { useForm } from '@tanstack/react-form';
import { Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function RecipeAIGenerationModal() {
  const { t } = useTranslation();
  const { generateRecipe, processing, wasSuccessful } = useGenerateRecipe();
  const { show_recipe_ai_generation_modal } = useRecipesContextValue();
  const [isOpen, setIsOpen] = useState(show_recipe_ai_generation_modal);

  useEffect(() => {
    if (wasSuccessful) {
      setIsOpen(false);
    }
  }, [wasSuccessful]);

  const form = useForm({
    defaultValues: {
      prompt: '',
      image_generation: false,
    },
    validators: {
      onSubmit: recipeAIGenerationRequestSchema,
    },
    onSubmit: ({ value }) => {
      generateRecipe(value);
    },
  });

  if (!isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 py-2 tracking-tight text-secondary">
            <Wand2 className="h-8 w-8" />
            {t('recipes.generate.modalTitle', 'Generate Recipe with AI')}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col"
        >
          <label className="label flex flex-col items-start gap-2.5">
            <form.Field
              name="prompt"
              children={(field) => (
                <textarea
                  className="textarea-bordered textarea w-full rounded-xl pt-4 pl-5 text-sm"
                  placeholder={t(
                    'recipes.generate.prompt.placeholder',
                    "Describe the recipe you want to create, e.g., 'A healthy Mediterranean chicken dish with vegetables'",
                  )}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={processing}
                  rows={10}
                />
              )}
            />
          </label>

          {/* Switch pour générer l'image */}
          <div className="mt-4 flex items-center justify-between border-t border-base-300/50 pt-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t(
                  'recipes.generate.imageGeneration.label',
                  'Générer une image',
                )}
              </label>
              <p className="text-xs text-base-content/60">
                {t(
                  'recipes.generate.imageGeneration.description',
                  "L'IA créera une photo de la recette (peut prendre plus de temps)",
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

          <div className="modal-action gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn"
              disabled={processing}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="btn gap-2 pl-4.5 btn-secondary"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="loading loading-sm loading-spinner"></span>
                  {t('recipes.generate.generating', 'Generating...')}
                </>
              ) : (
                <>
                  {t('recipes.generate.button', 'Generate recipe')}
                  <Wand2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
