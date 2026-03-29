import FieldInfo from '@/app/components/ui/form-field-info';
import { stepRequestSchema } from '@/app/data/requests/recipe/schemas/entities/step.request.schema';
import { StepRequest } from '@/app/data/requests/recipe/types';
import { useAppForm, withFieldGroup } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultValues: { steps: StepRequest[] } = {
  steps: [],
};

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
      const reorderedSteps = newSteps.map((s, i) => ({
        ...s,
        order: i + 1,
      }));
      group.setFieldValue('steps', reorderedSteps);
    };

    return (
      <group.AppField
        mode="array"
        name="steps"
        children={(steps_field) => (
          <div className="flex flex-col gap-4">
            <span className="text-base-content">{title}</span>

            <div className="flex flex-col gap-5">
              {steps_field.state.value &&
                steps_field.state.value.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {steps_field.state.value.map((_, index: number) => (
                      <group.AppField
                        key={index}
                        name={`steps[${index}].description`}
                        children={(field) => (
                          <div className="flex items-start gap-2 rounded-md bg-base-100 p-3">
                            <field.TextAreaField rows={undefined} />
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(index)}
                              className="rounded-md p-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={18} className="text-red-700" />
                            </button>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                )}

              <form.AppField
                name="description"
                children={(field) => (
                  <div onBlur={() => steps_field.handleBlur()}>
                    <field.TextAreaField
                      rows={10}
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
                    className="btn w-fit border-secondary/20 pl-6.5 btn-soft btn-secondary"
                  >
                    {t('recipes.steps.addButton', 'Add step')}
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
