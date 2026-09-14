import FieldInfo from '@/app/components/ui/form-field-info';
import { stepRequestSchema } from '@/app/data/requests/recipe/schemas/entities/step.request.schema';
import { StepRequest } from '@/app/data/requests/recipe/types';
import { useAppForm, withFieldGroup } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { ChevronDown, ChevronUp, PlusIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultValues: { steps: StepRequest[] } = {
  steps: [],
};

const stepRowClassName = 'flex w-full min-w-0 flex-col gap-3';

const stepHeaderClassName =
  'flex w-full min-w-0 items-center justify-between gap-3';

const stepActionsClassName =
  'flex min-w-0 flex-wrap justify-end gap-2';

const stepActionButtonClassName =
  'rounded-md bg-base-200 p-2 text-base-content/70 hover:bg-base-300 disabled:pointer-events-none disabled:opacity-40';

function reorderSteps(steps: StepRequest[]): StepRequest[] {
  return steps.map((step, index) => ({
    ...step,
    order: index + 1,
  }));
}

export const RecipeFormStepsSection = withFieldGroup({
  defaultValues,
  props: {
    title: '',
  },
  render: function Render({ group, title }) {
    const { t } = useTranslation();

    const form = useAppForm({
      defaultValues: { description: '', order: 0 },
      validators: {
        onSubmit: stepRequestSchema,
      },
      onSubmit: ({ value }) => {
        const currentSteps = group.getFieldValue('steps') ?? [];
        group.pushFieldValue('steps', {
          ...value,
          order: currentSteps.length + 1,
        });
        form.reset();
      },
    });

    const handleDeleteStep = (index: number): void => {
      const currentSteps = group.getFieldValue('steps');
      const newSteps = currentSteps?.filter((_, i) => i !== index) ?? [];
      group.setFieldValue('steps', reorderSteps(newSteps));
    };

    const moveStep = (index: number, direction: -1 | 1): void => {
      const currentSteps = group.getFieldValue('steps') ?? [];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= currentSteps.length) {
        return;
      }

      const reorderedSteps = [...currentSteps];
      [reorderedSteps[index], reorderedSteps[nextIndex]] = [
        reorderedSteps[nextIndex],
        reorderedSteps[index],
      ];

      group.setFieldValue('steps', reorderSteps(reorderedSteps));
    };

    return (
      <group.AppField
        mode="array"
        name="steps"
        children={(steps_field) => (
          <div className="flex w-full min-w-0 flex-col gap-4">
            {title && (
              <span className="text-base font-bold text-base-content">
                {title}
              </span>
            )}

            <div className="flex min-w-0 flex-col gap-5">
              {steps_field.state.value &&
                steps_field.state.value.length > 0 && (
                  <div className="flex min-w-0 flex-col gap-3">
                    {steps_field.state.value.map((_, index: number) => (
                      <group.AppField
                        key={index}
                        name={`steps[${index}].description`}
                        children={(field) => (
                          <div className={stepRowClassName}>
                            <div className={stepHeaderClassName}>
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-content">
                                {index + 1}
                              </span>
                              <div className={stepActionsClassName}>
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveStep(index, -1)}
                                  className={stepActionButtonClassName}
                                  aria-label={t(
                                    'recipes.steps.moveUpButton',
                                    "Monter l'étape",
                                  )}
                                >
                                  <ChevronUp size={18} />
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    index ===
                                    (steps_field.state.value?.length ?? 0) - 1
                                  }
                                  onClick={() => moveStep(index, 1)}
                                  className={stepActionButtonClassName}
                                  aria-label={t(
                                    'recipes.steps.moveDownButton',
                                    "Descendre l'étape",
                                  )}
                                >
                                  <ChevronDown size={18} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStep(index)}
                                  className={stepActionButtonClassName}
                                  aria-label={t(
                                    'recipes.steps.removeButton',
                                    "Supprimer l'étape",
                                  )}
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                            <field.TextAreaField rows={5} />
                          </div>
                        )}
                      />
                    ))}
                  </div>
                )}

              <form.AppField
                name="description"
                children={(field) => (
                  <div
                    className={stepRowClassName}
                    onBlur={() => steps_field.handleBlur()}
                  >
                    <div className={stepHeaderClassName}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-content">
                        {(steps_field.state.value?.length ?? 0) + 1}
                      </span>
                      <div className={stepActionsClassName}>
                        <button
                          type="button"
                          disabled
                          className={stepActionButtonClassName}
                          aria-label={t(
                            'recipes.steps.moveUpButton',
                            "Monter l'étape",
                          )}
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          type="button"
                          disabled
                          className={stepActionButtonClassName}
                          aria-label={t(
                            'recipes.steps.moveDownButton',
                            "Descendre l'étape",
                          )}
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button
                          type="button"
                          disabled
                          className={stepActionButtonClassName}
                          aria-label={t(
                            'recipes.steps.removeButton',
                            "Supprimer l'étape",
                          )}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <field.TextAreaField
                      rows={5}
                      placeholder={t(
                        'recipes.steps.instructionPlaceholder',
                        'Describe this step',
                      )}
                      className={cn(
                        !steps_field.state.meta.isValid && 'textarea-error',
                      )}
                    />
                  </div>
                )}
              />

              <FieldInfo />

              <form.Subscribe>
                {(state) => (
                  <button
                    type="button"
                    disabled={!state.canSubmit || state.isSubmitting}
                    onClick={() => {
                      form.handleSubmit();
                      steps_field.setErrorMap({ onBlur: undefined });
                    }}
                    className="btn w-full max-w-full min-w-0 border-secondary/20 pl-6.5 btn-soft btn-secondary sm:w-fit"
                  >
                    <span className="min-w-0 truncate">
                      {t('recipes.steps.addButton', 'Add step')}
                    </span>
                    <PlusIcon className="h-5 shrink-0 pt-[2px]" />
                  </button>
                )}
              </form.Subscribe>
            </div>
          </div>
        )}
      />
    );
  },
});
