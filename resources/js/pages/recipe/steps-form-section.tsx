import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { stepSchema } from '@/schemas/recipe.schema';
import { Recipe } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultValues: Pick<Recipe, 'steps'> = {
  steps: [],
};

const StepsFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: '', // Title will be passed from parent component
  },
  render: function Render({ group, title }) {
    const { t } = useTranslation();
    const form = useAppForm({
      defaultValues: { description: '', order: 0 },
      validators: {
        onSubmit: stepSchema,
      },
      onSubmit: ({ value }) => {
        const currentSteps = group.getFieldValue('steps');
        group.pushFieldValue('steps', {
          ...value,
          order: currentSteps.length + 1,
        });
        form.reset();
      },
    });

    const handleDeleteStep = (index: number): void => {
      const currentSteps = group.getFieldValue('steps');
      const newSteps = currentSteps.filter((_, i) => i !== index);
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
        children={(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-md">{title}</span>

            <div className="flex flex-col gap-3">
              {field.state.value.length > 0 && (
                <div className="flex flex-col gap-2">
                  {field.state.value.map((step, index) => (
                    <group.AppField
                      key={index}
                      name={`steps[${index}].description`}
                      children={(field) => (
                        <div className="flex items-start gap-2 rounded-md bg-gray-50 p-3">
                          <span className="flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                            {step.order}
                          </span>
                          <field.TextAreaField rows={2} />
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
                  <field.TextAreaField
                    placeholder={t('recipes.steps.instructionPlaceholder')}
                    rows={3}
                  />
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
                    }}
                    className="btn flex w-fit btn-accent"
                  >
                    <Plus size={16} /> {t('recipes.steps.addButton')}
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

export default StepsFormSection;
