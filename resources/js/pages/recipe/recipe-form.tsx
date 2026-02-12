import { ImageUpload } from '@/components/image-upload';
import FieldInfo from '@/components/ui/form-field-info';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAppForm } from '@/hooks/form-hook';
import IngredientFormSection from '@/pages/recipe/ingredient-form-section';
import { recipeSchema } from '@/schemas/recipe.schema';
import { Ingredient, MealTime, Recipe, Tag } from '@/types';
import { useTranslation } from 'react-i18next';
import StepsFormSection from './steps-form-section';
import TagsFormSection from './tags-form-section';

type RecipeFormProps = {
  defaultValues: Omit<Recipe, 'id'>;
  mode: 'create' | 'edit';
  submitLabel?: string;
  onSubmit: (props: { value: Omit<Recipe, 'id'> }) => void;
  cancelLabel?: string;
  onCancel?: () => void;
  meal_times: {
    data: MealTime[];
  };
  tags_search_results?: {
    data: Tag[];
  };
  ingredients_search_results?: {
    data: Ingredient[];
  };
};

export function RecipeForm({
  defaultValues,
  mode,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
  meal_times,
  tags_search_results = { data: [] },
  ingredients_search_results = { data: [] },
}: RecipeFormProps) {
  const { t } = useTranslation();

  const defaultSubmitLabel =
    submitLabel ||
    (mode === 'edit'
      ? t('common.buttons.update', 'Update')
      : t('recipes.form.saveButton', 'Save recipe'));
  const defaultCancelLabel =
    cancelLabel || t('common.buttons.cancel', 'Cancel');
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
      className="flex flex-col gap-7"
    >
      <div className="grid gap-x-12 gap-y-8 min-2xl:grid-cols-[9fr_10fr]">
        <form.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label={t('recipes.form.nameLabel', 'Recipe name')}
              placeholder={t(
                'recipes.form.namePlaceholder',
                'Enter recipe name',
              )}
            />
          )}
        />

        <form.AppField
          name="description"
          children={(field) => (
            <field.TextAreaField
              label={t('recipes.form.descriptionLabel', 'Description')}
              placeholder={t(
                'recipes.form.descriptionPlaceholder',
                'Describe your recipe',
              )}
              rows={10}
            />
          )}
        />

        <form.AppField
          name="meal_times"
          children={(field) => {
            const options = meal_times.data.map((meal_time) => ({
              value: meal_time.name,
              label: meal_time.name,
            }));
            return (
              <div className="flex flex-col gap-4">
                <label className="text-md text-base-content">
                  {t('recipes.form.mealTimesTitle', 'Meal times')}
                </label>
                <MultiSelect
                  options={options}
                  value={field.state.value.map((v) => v.name)}
                  onValueChange={(values) =>
                    field.handleChange(
                      values.flatMap((v) => {
                        return meal_times.data.filter((m) => m.name === v);
                      }),
                    )
                  }
                  placeholder={t(
                    'recipes.form.mealTimesPlaceholder',
                    'Select meal times...',
                  )}
                />
                <FieldInfo />
              </div>
            );
          }}
        />

        <div className="grid grid-cols-3 gap-5">
          <form.AppField
            name="serving_size"
            children={(field) => (
              <field.NumberField
                value={field.state.value}
                label={t('recipes.form.servingSizeLabel', 'Serving size')}
                placeholder="1"
                min="1"
                max="50"
              />
            )}
          />

          <form.AppField
            name="preparation_time"
            children={(field) => (
              <field.NumberField
                value={field.state.value}
                label={t(
                  'recipes.form.preparationTimeLabel',
                  'Preparation time',
                )}
                placeholder="0"
                min="0"
              />
            )}
          />

          <form.AppField
            name="cooking_time"
            children={(field) => (
              <field.NumberField
                value={field.state.value}
                label={t('recipes.form.cookingTimeLabel', 'Cooking time')}
                placeholder="0"
                min="0"
              />
            )}
          />
        </div>

        <form.AppField
          name="image"
          children={(field) => (
            <ImageUpload
              value={field.state.value}
              onChange={field.handleChange}
              currentImageUrl={defaultValues.image_url}
              className="min-2xl:col-start-2 min-2xl:row-start-1 min-2xl:row-end-4"
            />
          )}
        />

        <div className="min-2xl:col-start-2 min-2xl:row-start-4 min-2xl:row-end-6">
          <TagsFormSection
            form={form}
            fields={{ tags: 'tags' }}
            tags_search_results={tags_search_results}
          />
        </div>

        <div className="min-2xl:row-start-5 min-2xl:row-end-8">
          <StepsFormSection
            form={form}
            fields={{ steps: 'steps' }}
            title={t('recipes.form.stepsTitle', 'Steps')}
          />
        </div>

        <IngredientFormSection
          form={form}
          fields={{ ingredients: 'ingredients' }}
          title={t('recipes.form.ingredientsTitle', 'Ingredients')}
          ingredients_search_results={ingredients_search_results}
        />
      </div>

      <div className="flex justify-end gap-4">
        <form.AppForm>
          <form.SubmitButton label={defaultSubmitLabel} />
        </form.AppForm>
        <button type="reset" className="btn" onClick={handleCancel}>
          {defaultCancelLabel}
        </button>
      </div>
    </form>
  );
}
