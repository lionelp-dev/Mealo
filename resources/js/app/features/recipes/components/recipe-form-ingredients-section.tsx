import { useRecipesContextValue } from '../inertia.adapter';
import { useSearchIngredients } from '../repositories/use-search-ingredients';
import FieldInfo from '@/app/components/ui/form-field-info';
import { recipeIngredientRequestSchema } from '@/app/data/requests/recipe/schemas/entities/recipe-ingredient.request.schema';
import { recipeSearchRequestSchema } from '@/app/data/requests/recipe/schemas/recipe-search.request.schema';
import { recipeStoreRequestSchema } from '@/app/data/requests/recipe/schemas/recipe-store.request.schema';
import { RecipeIngredientRequest } from '@/app/data/requests/recipe/types';
import { useAppForm, withFieldGroup } from '@/app/hooks/form-hook';
import { cn } from '@/app/lib/';
import { InfiniteScroll } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { PlusIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceValue } from 'usehooks-ts';

const defaultValues: { ingredients: RecipeIngredientRequest[] } = {
  ingredients: [],
};

function parseQuantityInput(value: string): number {
  return value === '' ? 0 : Math.round(Number(value) * 100) / 100;
}

export const RecipeFormIngredientsSection = withFieldGroup({
  defaultValues,
  props: {
    title: '',
  },
  render: function Render({ group, title }) {
    const { t } = useTranslation();

    const { url, ingredients_search_results, ingredient_categories } =
      useRecipesContextValue();

    const defaultCategoryId =
      ingredient_categories?.find((category) => category.slug === 'autres')
        ?.id ??
      ingredient_categories?.[0]?.id ??
      0;

    const { searchIngredients, processing } = useSearchIngredients();

    const [debouncedValue, setSearchTerm] = useDebounceValue('', 300);

    useEffect(() => {
      if (!processing) {
        searchIngredients(url, {
          ingredients_search: debouncedValue,
        });
      }
    }, [debouncedValue]);

    const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);

    const form = useAppForm({
      defaultValues: {
        name: '',
        quantity: 0,
        unit: '',
        category_id: defaultCategoryId,
      },
      validators: {
        onSubmit: recipeIngredientRequestSchema,
        onChange: ({ value }) => {
          const result =
            recipeSearchRequestSchema.shape.ingredients_search.safeParse(
              value.name,
            );
          if (!result) return;
          setSearchTerm(value.name);
        },
      },
      onSubmit: ({ value }) => {
        group.pushFieldValue('ingredients', value);
        form.reset();
        group.setFieldMeta('ingredients', (prev) => ({ ...prev, errors: [] }));
      },
    });

    return (
      <group.AppField
        name="ingredients"
        mode="array"
        validators={{
          onSubmit: recipeStoreRequestSchema.shape.ingredients,
          onBlur: recipeStoreRequestSchema.shape.ingredients,
        }}
        children={(ingredientsField) => {
          const ingredients = ingredientsField.state.value ?? [];
          const hasIngredients = ingredients.length > 0;
          const gridClassName = cn(
            'grid w-full min-w-0 gap-3 sm:items-start',
            hasIngredients
              ? 'sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_46px]'
              : 'sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]',
          );
          const categoryOptions =
            ingredient_categories?.map((category) => ({
              value: category.id,
              label: category.name,
            })) ?? [];

          function IngredientRows() {
            return (
              <>
                {ingredients.map((_, index) => (
                  <div
                    key={index}
                    className="grid min-w-0 gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 sm:contents"
                  >
                    <div className="min-w-0">
                      <group.AppField
                        name={`ingredients[${index}].name`}
                        children={(field) => (
                          <field.TextField
                            label={t('recipes.ingredients.nameLabel', 'Nom')}
                            onBlur={() => ingredientsField.handleBlur()}
                          />
                        )}
                      />
                    </div>
                    <div className="grid min-w-0 grid-cols-2 gap-3 sm:contents">
                      <div className="min-w-0">
                        <group.AppField
                          name={`ingredients[${index}].quantity`}
                          children={(field) => (
                            <field.NumberField
                              label={t(
                                'recipes.ingredients.quantityLabel',
                                'Quantité',
                              )}
                              value={field.state.value}
                              min="0"
                              step="0.01"
                              className="sm:w-24"
                              onBlur={() => ingredientsField.handleBlur()}
                              onChange={(e) =>
                                field.handleChange(
                                  parseQuantityInput(e.target.value),
                                )
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <group.AppField
                          name={`ingredients[${index}].unit`}
                          children={(field) => (
                            <field.TextField
                              label={t(
                                'recipes.ingredients.unitLabel',
                                'Unité',
                              )}
                              className="sm:w-24"
                              onBlur={() => ingredientsField.handleBlur()}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <group.AppField
                        name={`ingredients[${index}].category_id`}
                        children={(field) => (
                          <field.SelectField
                            label={t(
                              'recipes.ingredients.categoryLabel',
                              'Catégorie',
                            )}
                            options={categoryOptions}
                            className="w-full"
                          />
                        )}
                      />
                    </div>
                    <div className="sm:hidden">
                      <button
                        type="button"
                        onClick={() => ingredientsField.removeValue(index)}
                        className="btn w-full max-w-full min-w-0 border-red-100 bg-red-50 text-red-700 hover:border-red-200 hover:bg-red-100"
                      >
                        <Trash2 className="size-4" />
                        <span className="min-w-0 truncate">
                          {t('recipes.ingredients.removeButton', 'Supprimer')}
                        </span>
                      </button>
                    </div>
                    <div className="hidden sm:block sm:pt-10">
                      <button
                        type="button"
                        onClick={() => ingredientsField.removeValue(index)}
                        className="btn h-10 min-h-0 w-10 border-red-100 bg-red-50 p-0 text-red-700 hover:border-red-200 hover:bg-red-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            );
          }

          function NewIngredientRow() {
            return (
              <div
                className="relative grid min-w-0 gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 sm:contents"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    ingredientsField.handleBlur();
                  }
                }}
              >
                <div className="min-w-0">
                  <Popover.Root
                    open={isPopoverOpen}
                    onOpenChange={setPopoverOpen}
                  >
                    <Popover.Anchor className="flex min-w-0">
                      <form.AppField
                        name="name"
                        children={(field) => (
                          <div className="min-w-0 flex-1">
                            <field.TextField
                              label={t('recipes.ingredients.nameLabel', 'Nom')}
                              data-ingredient-input
                              value={field.state.value}
                              onFocus={() => setPopoverOpen(true)}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                setPopoverOpen(true);
                              }}
                              placeholder={t(
                                'recipes.ingredients.namePlaceholder',
                                "Nom de l'ingrédient",
                              )}
                              autoComplete="off"
                              className={cn(
                                !ingredientsField.state.meta.isValid &&
                                  'input-error',
                                !field.state.meta.isValid && 'input-error',
                              )}
                            />
                          </div>
                        )}
                      />
                    </Popover.Anchor>
                    <Popover.Content
                      side="top"
                      sideOffset={8}
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="z-50 max-w-[calc(100vw-2rem)]"
                    >
                      {ingredients_search_results?.data &&
                        ingredients_search_results.data.length > 0 && (
                          <div className="flex max-w-full overflow-hidden rounded-sm border border-solid border-base-300 bg-base-100 p-1">
                            <div className="max-h-40 max-w-full overflow-y-auto">
                              <InfiniteScroll
                                data="ingredients_search_results"
                                preserveUrl
                              >
                                {ingredients_search_results.data.map(
                                  (ingredient) => (
                                    <div
                                      key={ingredient.id}
                                      className="flex max-w-full cursor-pointer items-center justify-between rounded px-3 py-2 text-base hover:bg-base-200"
                                      onClick={() => {
                                        form.setFieldValue(
                                          'name',
                                          ingredient.name,
                                        );
                                        form.setFieldValue(
                                          'category_id',
                                          ingredient.category_id,
                                        );
                                        setPopoverOpen(false);
                                      }}
                                    >
                                      <span className="min-w-0 truncate">
                                        {ingredient.name}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </InfiniteScroll>
                            </div>
                          </div>
                        )}
                    </Popover.Content>
                  </Popover.Root>
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-3 sm:contents">
                  <div className="min-w-0">
                    <form.AppField
                      name="quantity"
                      validators={{
                        onChange: recipeIngredientRequestSchema.shape.quantity,
                        onBlur: recipeIngredientRequestSchema.shape.quantity,
                      }}
                      children={(field) => (
                        <field.NumberField
                          label={t(
                            'recipes.ingredients.quantityLabel',
                            'Quantité',
                          )}
                          value={field.state.value}
                          min="0"
                          step="0.01"
                          className={cn(
                            'sm:w-24',
                            !ingredientsField.state.meta.isValid &&
                              'input-error',
                            !field.state.meta.isValid && 'input-error',
                          )}
                          onBlur={(e) => e.preventDefault()}
                          onChange={(e) =>
                            field.handleChange(
                              parseQuantityInput(e.target.value),
                            )
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <form.AppField
                      name="unit"
                      children={(field) => (
                        <field.TextField
                          label={t('recipes.ingredients.unitLabel', 'Unité')}
                          onBlur={(e) => e.preventDefault()}
                          placeholder={t(
                            'recipes.ingredients.unitLabel',
                            'Unit',
                          )}
                          className={cn(
                            'sm:w-24',
                            !ingredientsField.state.meta.isValid &&
                              'input-error',
                            !field.state.meta.isValid && 'input-error',
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <form.AppField
                    name="category_id"
                    validators={{
                      onChange: recipeIngredientRequestSchema.shape.category_id,
                      onBlur: recipeIngredientRequestSchema.shape.category_id,
                    }}
                    children={(field) => (
                      <field.SelectField
                        label={t(
                          'recipes.ingredients.categoryLabel',
                          'Catégorie',
                        )}
                        options={categoryOptions}
                        className={cn(
                          'w-full',
                          !ingredientsField.state.meta.isValid &&
                            'select-error',
                          !field.state.meta.isValid && 'select-error',
                        )}
                      />
                    )}
                  />
                </div>
                {hasIngredients && <div className="hidden sm:block" />}
              </div>
            );
          }

          return (
            <div className="flex w-full min-w-0 flex-col gap-4">
              {title && (
                <span className="text-base font-bold text-base-content">
                  {title} *
                </span>
              )}
              <div className="flex min-w-0 flex-col gap-5">
                <div className={gridClassName}>
                  {IngredientRows()}
                  {NewIngredientRow()}
                </div>

                <FieldInfo />
                <form.Subscribe>
                  {(state) => (
                    <button
                      type="button"
                      disabled={!state.canSubmit}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                        ingredientsField.setErrorMap({
                          onBlur: undefined,
                          onSubmit: undefined,
                        });
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="btn w-full max-w-full min-w-0 border-secondary/20 pl-6.5 btn-soft btn-secondary sm:w-fit"
                    >
                      <span className="min-w-0 truncate">
                        {t('recipes.ingredients.addButton', 'Add ingredient')}
                      </span>
                      <PlusIcon className="h-5 shrink-0 pt-[2px]" />
                    </button>
                  )}
                </form.Subscribe>
              </div>
            </div>
          );
        }}
      />
    );
  },
});
