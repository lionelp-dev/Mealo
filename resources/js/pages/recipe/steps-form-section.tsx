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
    title: '',
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
          <div className="flex flex-col gap-4">
            <span className="text-base-content">{title}</span>

            <div className="flex flex-col gap-5">
              {field.state.value.length > 0 && (
                <div className="flex flex-col gap-2">
                  {field.state.value.map((_, index) => (
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
                  <field.TextAreaField
                    rows={10}
                    placeholder={t('recipes.steps.instructionPlaceholder', 'Describe this step')}
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
                    className="btn w-fit"
                  >
                    <Plus size={16} /> {t('recipes.steps.addButton', 'Add step')}
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
