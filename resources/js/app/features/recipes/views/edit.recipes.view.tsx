import { RecipeFormIngredientsSection } from '../components/recipe-form-ingredients-section';
import { RecipeFormStepsSection } from '../components/recipe-form-steps-section';
import { RecipeFormTagsSection } from '../components/recipe-form-tags-section';
import { useRecipesContextValue } from '../inertia.adapter';
import { viewRecipe } from '../repositories/recipes.repository';
import { useUpdateRecipe } from '../repositories/use-update-recipe';
import { AppMainContent } from '@/app/components/app-main-content';
import { ImageUpload } from '@/app/components/image-upload';
import { LanguageSwitcher } from '@/app/components/language-switcher';
import { updateRecipeRequestSchema } from '@/app/data/requests/recipe/schemas/update-recipe.request.schema';
import { UpdateRecipeRequest } from '@/app/data/requests/recipe/types';
import { useAppForm } from '@/app/hooks/form-hook';
import AppLayout from '@/app/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export function EditRecipesView() {
  const { t } = useTranslation();

  const { recipe, meal_times } = useRecipesContextValue();

  const { updateRecipe } = useUpdateRecipe();

  const defaultValues: UpdateRecipeRequest = {
    id: recipe.id,
    name: recipe.name ?? '',
    description: recipe.description ?? '',
    serving_size: recipe.serving_size ?? 1,
    preparation_time: recipe.preparation_time ?? 0,
    cooking_time: recipe.cooking_time ?? 0,
    ingredients: recipe.ingredients ?? [],
    steps: recipe.steps ?? [],
    tags: recipe.tags ?? [],
    meal_times: recipe.meal_times ?? [],
    image: null,
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: updateRecipeRequestSchema,
    },
    onSubmit: ({ value }) => {
      updateRecipe(value, recipe.id);
    },
  });

  return (
    <AppLayout
      headerRightContent={
        <div className="flex items-center gap-8">
          <div className="flex justify-end gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`btn btn-secondary`}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? '...' : t('common.buttons.update', 'Update')}
                </button>
              )}
            </form.Subscribe>
            <button
              type="reset"
              className="btn"
              onClick={() => viewRecipe(recipe.id)}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
          </div>

          <LanguageSwitcher />
        </div>
      }
    >
      <Head title={t('recipes.edit.pageTitle', 'Edit recipe')}></Head>
      <AppMainContent>
        <h1 className="mb-6 text-2xl font-bold">
          {t('recipes.edit.title', 'Edit recipe')}
        </h1>
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
              mode="array"
              validators={{
                onChange: updateRecipeRequestSchema.shape.meal_times,
                onBlur: updateRecipeRequestSchema.shape.meal_times,
              }}
              children={(field) => {
                const options = meal_times.map((mt) => ({
                  value: mt.id,
                  label: mt.name,
                }));

                return (
                  <field.MultiSelectField
                    options={options}
                    label={t('recipes.form.mealTimesTitle', 'Meal times')}
                  />
                );
              }}
            />

            <div className="grid grid-flow-col gap-5">
              <form.AppField
                name="serving_size"
                children={(field) => (
                  <field.NumberField
                    value={field.state.value}
                    label={t(
                      'recipes.form.servingSizeLabel',
                      'Nombre de portions',
                    )}
                    placeholder="4"
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
                      'Preparation time (minutes)',
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
                    label={t(
                      'recipes.form.cookingTimeLabel',
                      'Cooking time (minutes)',
                    )}
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
                  currentImageUrl={recipe.image_url}
                  className="min-2xl:col-start-2 min-2xl:row-start-1 min-2xl:row-end-4"
                />
              )}
            />

            <div className="min-2xl:col-start-2 min-2xl:row-start-4 min-2xl:row-end-6">
              <RecipeFormTagsSection form={form} fields={{ tags: 'tags' }} />
            </div>

            <div className="min-2xl:row-start-5 min-2xl:row-end-8">
              <RecipeFormStepsSection
                form={form}
                fields={{ steps: 'steps' }}
                title={t('recipes.form.stepsTitle', 'Steps')}
              />
            </div>

            <RecipeFormIngredientsSection
              form={form}
              fields={{ ingredients: 'ingredients' }}
              title={t('recipes.form.ingredientsTitle', 'Ingredients')}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="btn"
              onClick={() => viewRecipe(recipe.id)}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
            <form.AppForm>
              <form.SubmitButton label={t('common.buttons.update', 'Update')} />
            </form.AppForm>
          </div>
        </form>
      </AppMainContent>
    </AppLayout>
  );
}
