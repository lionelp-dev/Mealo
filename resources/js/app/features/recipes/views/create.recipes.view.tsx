import { RecipeAIPrefillSection } from '../components/recipe-ai-prefill-section';
import { RecipeFormCard } from '../components/recipe-form-card';
import { RecipeFormIngredientsSection } from '../components/recipe-form-ingredients-section';
import { RecipeFormStepsSection } from '../components/recipe-form-steps-section';
import { RecipeFormTagsSection } from '../components/recipe-form-tags-section';
import { useRecipesContextValue } from '../inertia.adapter';
import { viewRecipes } from '../repositories/recipes.repository';
import { useCreateRecipe } from '../repositories/use-create-recipe';
import { useGenerateRecipeImage } from '../repositories/use-generate-recipe-image';
import { PageContainer } from '@/app/components/page-container';
import { recipeStoreRequestSchema } from '@/app/data/requests/recipe/schemas/recipe-store.request.schema';
import {
  GeneratedRecipeResource,
  RecipeStoreRequest,
} from '@/app/data/requests/recipe/types';
import { useAppForm } from '@/app/hooks/form-hook';
import AppLayout from '@/app/layouts/app-layout';
import { base64ToFile } from '@/app/utils';
import { Head } from '@inertiajs/react';
import { useStore } from '@tanstack/react-form';
import { ChefHatIcon, Wand2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function recipeFormValuesFromGeneratedRecipe(
  generatedRecipe?: GeneratedRecipeResource,
): RecipeStoreRequest {
  return {
    name: generatedRecipe?.name ?? '',
    description: generatedRecipe?.description ?? '',
    serving_size: generatedRecipe?.serving_size ?? 1,
    preparation_time: generatedRecipe?.preparation_time ?? 0,
    cooking_time: generatedRecipe?.cooking_time ?? 0,
    ingredients: generatedRecipe?.ingredients ?? [],
    steps: generatedRecipe?.steps ?? [],
    tags: generatedRecipe?.tags ?? [],
    meal_times: generatedRecipe?.meal_times ?? [],
    image: null,
  };
}

export function CreateRecipesView() {
  const { t } = useTranslation();

  const { meal_times, generated_recipe, generated_image_data_url } =
    useRecipesContextValue();

  const { createRecipe } = useCreateRecipe();

  const initialValues = {
    ...recipeFormValuesFromGeneratedRecipe(generated_recipe),
    image: generated_image_data_url
      ? base64ToFile(generated_image_data_url, 'image')
      : null,
  };

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: recipeStoreRequestSchema,
    },
    onSubmit: ({ value }) => {
      return createRecipe(value);
    },
  });

  const {
    generateRecipeImage,
    processing: imageGenerating,
    errors: imageErrors,
  } = useGenerateRecipeImage();

  const { name, ingredients } = useStore(form.store, (state) => state.values);

  const handleGenerateImage = () => {
    generateRecipeImage(name, ingredients);
  };

  useEffect(() => {
    if (!generated_recipe) return;

    const values = recipeFormValuesFromGeneratedRecipe(generated_recipe);

    form.setFieldValue('name', values.name);
    form.setFieldValue('description', values.description);
    form.setFieldValue('serving_size', values.serving_size);
    form.setFieldValue('preparation_time', values.preparation_time);
    form.setFieldValue('cooking_time', values.cooking_time);
    form.setFieldValue('ingredients', values.ingredients);
    form.setFieldValue('steps', values.steps);
    form.setFieldValue('tags', values.tags);
    form.setFieldValue('meal_times', values.meal_times);
    form.setFieldValue('image', values.image);
  }, [generated_recipe]);

  useEffect(() => {
    if (generated_image_data_url)
      form.setFieldValue(
        'image',
        base64ToFile(generated_image_data_url, 'image'),
      );
  }, [generated_image_data_url]);

  return (
    <AppLayout
      headerRightContent={
        <div className="flex min-w-0 items-center gap-3 sm:gap-8">
          <div className="flex min-w-0 flex-wrap justify-end gap-2 sm:gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn max-w-full min-w-0 btn-secondary max-sm:btn-sm min-sm:pr-3.5 min-sm:pl-[23px]"
                  onClick={() => form.handleSubmit()}
                >
                  <span className="min-w-0 truncate">
                    {isSubmitting
                      ? '...'
                      : t('recipes.form.saveButton', 'Enregistrer la recette')}
                  </span>
                  <ChefHatIcon className="h-4 max-md:hidden" />
                </button>
              )}
            </form.Subscribe>
            <button
              type="button"
              className="btn max-sm:hidden"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                viewRecipes();
              }}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      }
    >
      <Head title={t('recipes.create.pageTitle', 'Create recipe')}></Head>
      <PageContainer size="default">
        <h1 className="mb-6 text-2xl font-bold text-secondary">
          {t('recipes.create.title', 'Create a new recipe')}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex w-full min-w-0 flex-col gap-6"
        >
          <div className="grid w-full min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:gap-6">
            <div className="order-0 min-w-0 lg:order-none lg:col-span-2">
              <RecipeAIPrefillSection />
            </div>

            <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
              <RecipeFormCard
                title="Informations générales"
                className="order-1 lg:order-none"
              >
                <form.AppField
                  name="name"
                  validators={{
                    onChange: recipeStoreRequestSchema.shape.name,
                    onBlur: recipeStoreRequestSchema.shape.name,
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
                    onChange: recipeStoreRequestSchema.shape.description,
                    onBlur: recipeStoreRequestSchema.shape.description,
                  }}
                  children={(field) => (
                    <field.TextAreaField
                      label={t('recipes.form.descriptionLabel', 'Description')}
                      placeholder={t(
                        'recipes.form.descriptionPlaceholder',
                        'Describe your recipe',
                      )}
                      rows={5}
                    />
                  )}
                />
              </RecipeFormCard>

              <RecipeFormCard
                title={`${t('recipes.form.ingredientsTitle', 'Ingredients')} *`}
                className="order-4 lg:order-none"
              >
                <RecipeFormIngredientsSection
                  form={form}
                  fields={{ ingredients: 'ingredients' }}
                  title=""
                />
              </RecipeFormCard>

              <RecipeFormCard
                title={t('recipes.form.stepsTitle', 'Steps')}
                className="order-5 lg:order-none"
              >
                <RecipeFormStepsSection
                  form={form}
                  fields={{ steps: 'steps' }}
                  title=""
                />
              </RecipeFormCard>
            </div>

            <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
              <RecipeFormCard
                title={t('recipes.form.photoTitle', 'Photo')}
                className="order-2 lg:order-none"
              >
                {/* Composant ImageUpload existant */}
                <form.AppField
                  name="image"
                  validators={{
                    onChange: recipeStoreRequestSchema.shape.image,
                  }}
                  children={(field) => {
                    return (
                      <field.ImageUploadField
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    );
                  }}
                />
                <div className="divider">{t('common.or', 'Ou')}</div>
                {/* Message d'erreur si échec */}
                {imageErrors &&
                  imageErrors.map((error) => (
                    <div key={error} className="alert-sm alert alert-error">
                      <span className="text-xs">{error}</span>
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleGenerateImage();
                  }}
                  disabled={imageGenerating}
                  className="btn max-w-full min-w-0 gap-2 whitespace-normal btn-sm btn-secondary sm:w-fit"
                >
                  {imageGenerating ? (
                    <>
                      <span className="loading loading-xs loading-spinner"></span>
                      <span className="min-w-0 truncate">
                        {t(
                          'recipes.form.imageGeneration.generating',
                          'Génération...',
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span className="min-w-0 truncate">
                        {t(
                          'recipes.form.imageGeneration.button',
                          'Générer avec IA',
                        )}
                      </span>
                    </>
                  )}
                </button>
              </RecipeFormCard>

              <RecipeFormCard
                title={t('recipes.form.detailsTitle', 'Détails')}
                className="order-3 lg:order-none"
              >
                <form.AppField
                  name="meal_times"
                  mode="array"
                  validators={{
                    onChange: recipeStoreRequestSchema.shape.meal_times,
                    onBlur: recipeStoreRequestSchema.shape.meal_times,
                  }}
                  children={(field) => {
                    const options = (meal_times ?? []).map((mt) => ({
                      value: mt.id,
                      label: mt.name,
                      slug: mt.slug,
                    }));

                    return (
                      <field.MealTimesCheckboxField
                        options={options}
                        label={t('recipes.form.mealTimesTitle', 'Meal times')}
                      />
                    );
                  }}
                />

                <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-3">
                  <form.AppField
                    name="serving_size"
                    validators={{
                      onChange: recipeStoreRequestSchema.shape.serving_size,
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
                      onChange: recipeStoreRequestSchema.shape.preparation_time,
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
                      onChange: recipeStoreRequestSchema.shape.cooking_time,
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

                <RecipeFormTagsSection form={form} fields={{ tags: 'tags' }} />
              </RecipeFormCard>
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap justify-end gap-2 sm:gap-4">
            <button
              type="button"
              className="btn max-w-full min-w-0"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                viewRecipes();
              }}
            >
              {t('common.buttons.cancel', 'Cancel')}
            </button>
            <form.AppForm>
              <form.SubmitButton className="max-w-full min-w-0 pr-3.5 pl-[23px]">
                <span className="min-w-0 truncate">
                  {t('recipes.form.saveButton', 'Enregistrer la recette')}
                </span>
                <ChefHatIcon className="h-4" />
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </PageContainer>
    </AppLayout>
  );
}
