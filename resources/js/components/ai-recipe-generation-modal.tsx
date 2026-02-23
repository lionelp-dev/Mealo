import { router } from '@inertiajs/react';
import { useForm } from '@tanstack/react-form';
import { Wand2, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AIRecipeGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIRecipeGenerationModal({
  isOpen,
  onClose,
}: AIRecipeGenerationModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      prompt: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError(null);

      router.post(
        '/recipes/create',
        { prompt: value.prompt },
        {
          only: ['generated_recipe', 'flash'],
          onSuccess: (page) => {
            onClose();
            form.reset();
          },
          onFinish: () => {
            setIsLoading(false);
          },
        },
      );
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-open modal">
      <div className="modal-box flex max-w-2xl flex-col gap-1 divide-y divide-base-300/50 rounded-xl px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-3.5 pt-4 pb-2.5 text-xl font-semibold text-secondary">
            <Wand2 className="mb-1 h-8 w-8" />
            {t('recipes.generate.modalTitle', 'Generate Recipe with AI')}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-circle btn-square btn-ghost btn-sm"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

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
                  disabled={isLoading}
                  rows={10}
                />
              )}
            />
          </label>
          <div className="modal-action gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn"
              disabled={isLoading}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="btn gap-2 pl-4.5 btn-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
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
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
