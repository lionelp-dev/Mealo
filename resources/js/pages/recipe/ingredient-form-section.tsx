import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { ingredientSchema } from '@/schemas/recipe.schema';
import { RecipeFormInput } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const defaultValues: Pick<RecipeFormInput, 'ingredients'> = {
  ingredients: [],
};

const IngredientFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: 'Ingrédients',
  },
  render: function Render({ group, title }) {
    const form = useAppForm({
      defaultValues: { name: '', quantity: 0, unit: '' },
      validators: {
        onSubmit: ingredientSchema,
      },
      onSubmit: ({ value }) => {
        group.pushFieldValue('ingredients', value);
        form.reset();
      },
    });

    return (
      <group.AppField
        name="ingredients"
        mode="array"
        children={(field) => (
          <div className="flex flex-col gap-1">
            <span>{title}</span>

            <table className="table w-full table-xs">
              <thead>
                <tr>
                  <th className="w-[15%]">Quantité</th>
                  <th className="w-[15%]">Unité</th>
                  <th className="w-[60%]">Nom de l'ingrédient</th>
                  <th className="w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody className="*:border-none [&>tr:first-child>td]:pt-2 [&>tr>td:first-child]:pl-0 [&>tr>td:last-child]:pr-0">
                {field.state.value.map((_, index) => (
                  <tr key={index} className="*:align-top">
                    <td>
                      <group.AppField
                        name={`ingredients[${index}].quantity`}
                        children={(field) => (
                          <field.InputField
                            type="number"
                            min="0"
                            step="0.01"
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value === ''
                                  ? 0
                                  : Math.round(Number(e.target.value) * 100) /
                                      100,
                              )
                            }
                          />
                        )}
                      />
                    </td>
                    <td>
                      <group.AppField
                        name={`ingredients[${index}].unit`}
                        children={(field) => <field.InputField />}
                      />
                    </td>
                    <td>
                      <group.AppField
                        name={`ingredients[${index}].name`}
                        children={(field) => <field.InputField />}
                      />
                    </td>
                    <td className="align-top">
                      <button
                        type="button"
                        onClick={() => field.removeValue(index)}
                        className="btn text-red-700 btn-ghost hover:border-red-50 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="*:align-top">
                  <td>
                    <form.AppField
                      name="quantity"
                      children={(field) => (
                        <field.InputField
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value === ''
                                ? 0
                                : Math.round(Number(e.target.value) * 100) /
                                    100,
                            )
                          }
                        />
                      )}
                    />
                  </td>
                  <td>
                    <form.AppField
                      name="unit"
                      children={(field) => <field.InputField />}
                    />
                  </td>
                  <td>
                    <form.AppField
                      name="name"
                      children={(field) => <field.InputField />}
                    />
                  </td>
                  <td>
                    <form.Subscribe>
                      {(state) => (
                        <button
                          type="button"
                          disabled={!state.canSubmit || state.isSubmitting}
                          onClick={() => {
                            form.handleSubmit();
                          }}
                          className="btn btn-accent"
                        >
                          <Plus size={16} /> Ajouter
                        </button>
                      )}
                    </form.Subscribe>
                  </td>
                </tr>
              </tbody>
            </table>

            <FieldInfo />
          </div>
        )}
      />
    );
  },
});

export default IngredientFormSection;
