import { recipeSchema } from '../domain/recipe.schema';
import { useRecipesContextValue } from '../infrastructure/inertia.adapter';
import {
  createRecipe,
  viewRecipes,
} from '../infrastructure/repositories/recipes.repository';
import { RecipeFormIngredientsSection } from './components/recipe-form-ingredients-section';
import { RecipeFormStepsSection } from './components/recipe-form-steps-section';
import { RecipeFormTagsSection } from './components/recipe-form-tags-section';
import RecipeModalAIGeneration from './components/recipe-modal-ai-generation';
import { AppMainContent } from '@/components/app-main-content';
import { ImageUpload } from '@/components/image-upload';
import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm } from '@/hooks/form-hook';
import AppLayout from '@/layouts/app-layout';
import { MealTime } from '@/types';
import { Head } from '@inertiajs/react';
import { ChefHatIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

export function RecipesCreatePage() {
  const { t } = useTranslation();

  const { meal_times, generated_recipe } = useRecipesContextValue();

  const initialValues = {
    name: generated_recipe?.name ?? '',
    description: generated_recipe?.description ?? '',
    serving_size: generated_recipe?.serving_size ?? 1,
    preparation_time: generated_recipe?.preparation_time ?? 0,
    cooking_time: generated_recipe?.cooking_time ?? 0,
    ingredients: generated_recipe?.ingredients ?? [],
    steps: generated_recipe?.steps ?? [],
    tags: generated_recipe?.tags ?? [],
    meal_times: generated_recipe?.meal_times ?? [],
    image: generated_recipe?.image ?? null,
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: recipeSchema,
    },
    onSubmit: async ({ value }) => {
      return await createRecipe(value);
    },
  });

  useEffect(() => {
    if (generated_recipe) {
      form.reset(generated_recipe);
    }
  }, [generated_recipe]);

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
                  className={`btn pr-3.5 pl-[23px] btn-secondary`}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting
                    ? '...'
                    : t('recipes.form.saveButton', 'Enregistrer la recette')}
                  <ChefHatIcon className="h-4" />
                </button>
              )}
            </form.Subscribe>
            <button className="btn" onClick={() => viewRecipes()}>
              {t('common.buttons.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      }
    >
      <Head title={t('recipes.create.pageTitle', 'Create recipe')}></Head>
      <AppMainContent>
        <h1 className="mb-6 text-2xl font-bold text-secondary">
          {t('recipes.create.title', 'Create a new recipe')}
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
              validators={{
                onChange: recipeSchema.shape.name,
              }}
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
              validators={{
                onBlur: recipeSchema.shape.description,
              }}
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
                onChange: recipeSchema.shape.meal_times,
              }}
              children={(field) => {
                const options = meal_times.data.map((meal_time: MealTime) => ({
                  value: meal_time.name,
                  label: meal_time.name,
                }));
                return (
                  <div className="flex flex-col gap-4">
                    <label className="text-base text-base-content">
                      {t('recipes.form.mealTimesTitle', 'Meal times')}
                    </label>
                    <Select
                      isMulti
                      name="colors"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(values) =>
                        field.handleChange(
                          values.flatMap(
                            (v: { value: string; label: string }) => {
                              return meal_times.data.filter(
                                (m: MealTime) => m.name === v.value,
                              );
                            },
                          ),
                        )
                      }
                    />
                    <FieldInfo />
                  </div>
                );
              }}
            />

            <div className="grid grid-cols-3 gap-5">
              <form.AppField
                name="serving_size"
                validators={{
                  onChange: recipeSchema.shape.serving_size,
                }}
                children={(field) => (
                  <field.NumberField
                    value={field.state.value}
                    label={t(
                      'recipes.form.servingSizeLabel',
                      'Nombre de portions',
                    )}
                    placeholder="1"
                    min="1"
                    max="50"
                  />
                )}
              />

              <form.AppField
                name="preparation_time"
                validators={{
                  onChange: recipeSchema.shape.preparation_time,
                }}
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
                validators={{
                  onChange: recipeSchema.shape.cooking_time,
                }}
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
              validators={{
                onChange: recipeSchema.shape.image,
              }}
              children={(field) => (
                <ImageUpload
                  value={field.state.value}
                  onChange={field.handleChange}
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
            <button type="reset" className="btn" onClick={() => viewRecipes()}>
              {t('common.buttons.cancel', 'Cancel')}
            </button>
            <form.AppForm>
              <form.SubmitButton className="pr-3.5 pl-[23px]">
                {t('recipes.form.saveButton', 'Enregistrer la recette')}
                <ChefHatIcon className="h-4" />
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>

        <RecipeModalAIGeneration />
      </AppMainContent>
    </AppLayout>
  );
}
