import FieldInfo from '@/components/ui/form-field-info';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { useAppForm } from '@/hooks/form-hook';
import IngredientFormSection from '@/pages/recipe/ingredient-form-section';
import StepsFormSection from '@/pages/recipe/steps-form-section';
import TagsFormSection from '@/pages/recipe/tags-form-section';
import { recipeSchema } from '@/schemas/recipe.schema';
import { MealTime, Recipe } from '@/types';
import { usePage } from '@inertiajs/react';

type RecipeFormProps = {
  defaultValues: Omit<Recipe, 'id'>;
  mode: 'create' | 'edit';
  submitLabel?: string;
  onSubmit: (props: { value: Omit<Recipe, 'id'> }) => void;
  cancelLabel?: string;
  onCancel?: () => void;
};

type PageProps = {
  meal_times: {
    data: MealTime[];
  };
};

export function RecipeForm({
  defaultValues,
  mode,
  submitLabel = mode === 'edit' ? 'Mettre à jour' : 'Créer la recette',
  onSubmit,
  cancelLabel = 'Annuler',
  onCancel,
}: RecipeFormProps) {
  const { meal_times } = usePage<PageProps>().props;

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: recipeSchema,
    },
    onSubmit,
  });

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCancel) {
      onCancel();
    } else {
      form.reset();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <span className="text-md">Détails de la recette</span>

      <form.AppField
        name="name"
        children={(field) => (
          <field.InputField
            type="text"
            label="Titre"
            placeholder="Entrez le titre de votre recette"
          />
        )}
      />

      <form.AppField
        name="description"
        children={(field) => (
          <field.TextAreaField
            label="Description"
            placeholder="Décrivez votre recette"
            rows={6}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <form.AppField
          name="meal_times"
          children={(field) => {
            const options: Option[] = meal_times.data.map((meal_time) => ({
              value: meal_time.name,
              label: meal_time.name,
            }));
            return (
              <div className="flex flex-col">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Moments du repas
                </label>
                <MultiSelect
                  className="w-full"
                  options={options}
                  value={field.state.value.map((v) => v.name)}
                  onValueChange={(values) =>
                    field.handleChange(
                      values.flatMap((v) => {
                        return meal_times.data.filter((m) => m.name === v);
                      }),
                    )
                  }
                  placeholder="Sélectionnez les moments du repas..."
                />
                <FieldInfo />
              </div>
            );
          }}
        />

        <form.AppField
          name="preparation_time"
          children={(field) => (
            <field.InputField
              type="number"
              label="Temps de préparation (minutes)"
              placeholder="0"
              min="0"
              className="input"
            />
          )}
        />

        <form.AppField
          name="cooking_time"
          children={(field) => (
            <field.InputField
              type="number"
              label="Temps de cuisson (minutes)"
              placeholder="0"
              min="0"
            />
          )}
        />
      </div>

      <IngredientFormSection
        form={form}
        fields={{ ingredients: 'ingredients' }}
        title="Ingrédients"
      />

      <StepsFormSection
        form={form}
        fields={{ steps: 'steps' }}
        title="Etapes de la recette"
      />

      <TagsFormSection form={form} fields={{ tags: 'tags' }} title="Tags" />

      <div className="flex justify-end gap-4">
        <form.AppForm>
          <form.SubmitButton label={submitLabel} />
        </form.AppForm>
        <button type="reset" className="btn" onClick={handleCancel}>
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
