import { AppMainContent } from '@/components/app-main-content';
import { ImageUpload } from '@/components/image-upload';
import { LanguageSwitcher } from '@/components/language-switcher';
import FieldInfo from '@/components/ui/form-field-info';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAppForm } from '@/hooks/form-hook';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { recipeSchema } from '@/schemas/recipe.schema';
import { Ingredient, MealTime, Recipe, Tag } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import IngredientFormSection from './ingredient-form-section';
import StepsFormSection from './steps-form-section';
import TagsFormSection from './tags-form-section';

type PageProps = {
  recipe: {
    data: Recipe;
  };
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

function EditRecipe() {
  const { t } = useTranslation();
  const {
    recipe,
    meal_times,
    tags_search_results,
    ingredients_search_results,
  } = usePage<PageProps>().props;

  const form = useAppForm({
    defaultValues: recipe.data as Omit<Recipe, 'id'>,
    validators: {
      onChange: recipeSchema,
    },
    onSubmit: ({ value }) => {
      router.put(recipes.update.url(recipe.data.id), value);
    },
  });

  const handleCancel = () => {
    router.visit(recipes.show.url({ id: recipe.data.id }));
  };

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
                  className={`btn btn-primary`}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? '...' : t('common.buttons.update', 'Update')}
                </button>
              )}
            </form.Subscribe>
            <button type="reset" className="btn" onClick={handleCancel}>
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

            <div className="grid grid-flow-col gap-5">
              <form.AppField
                name="serving_size"
                children={(field) => (
                  <field.NumberField
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
                  currentImageUrl={recipe.data.image_url}
                  className="min-2xl:col-start-2 min-2xl:row-start-1 min-2xl:row-end-4"
                />
              )}
            />

            <div className="min-2xl:col-start-2 min-2xl:row-start-4 min-2xl:row-end-6">
              <TagsFormSection
                form={form}
                fields={{ tags: 'tags' }}
                tags_search_results={tags_search_results ?? { data: [] }}
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
              ingredients_search_results={
                ingredients_search_results ?? { data: [] }
              }
            />
          </div>

          <div className="flex justify-end gap-4">
            <button type="reset" className="btn" onClick={handleCancel}>
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

export default EditRecipe;
