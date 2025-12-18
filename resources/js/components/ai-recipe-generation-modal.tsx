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
      <div className="modal-box flex max-w-2xl flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-semibold">
            <Wand2 className="h-5 w-5" />
{t('recipes.generate.modalTitle')}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-square btn-ghost btn-sm"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-2"
        >
          <label className="label">
<span className="label-text">{t('recipes.generate.prompt.label')}</span>
          </label>
          <form.Field
            name="prompt"
            children={(field) => (
              <textarea
                className="textarea-bordered textarea w-full"
placeholder={t('recipes.generate.prompt.placeholder')}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading}
                rows={10}
              />
            )}
          />
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
{t('common.buttons.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-sm loading-spinner"></span>
{t('recipes.generate.generating')}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
{t('recipes.generate.button')}
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
