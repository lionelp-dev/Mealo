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

export const RecipeFormIngredientsSection = withFieldGroup({
  defaultValues,
  props: {
    title: '',
  },
  render: function Render({ group, title }) {
    const { t } = useTranslation();

    const { url, ingredients_search_results } = useRecipesContextValue();

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
        children={(ingredients_field) => (
          <div className="flex flex-col gap-4">
            <span className="text-base-content">{title}</span>
            <div className="flex flex-col gap-5">
              <table className="table -mt-1 -mb-1 w-full table-xs">
                <thead>
                  <tr className="[&>th]:pb-2 [&>th]:text-sm [&>th]:font-normal [&>th]:text-base-content">
                    <th className="w-[55%]">
                      {t('recipes.ingredients.nameLabel', 'Name')}
                    </th>
                    <th className="w-[15%]">
                      {t('recipes.ingredients.quantityLabel', 'Quantity')}
                    </th>
                    <th className="w-[20%]">
                      {t('recipes.ingredients.unitLabel', 'Unit')}
                    </th>
                    {ingredients_field.state.value &&
                      ingredients_field.state.value.length !== 0 && (
                        <th className="w-[10%]">
                          {t('recipes.table.actions', 'Actions')}
                        </th>
                      )}
                  </tr>
                </thead>
                <tbody className="*:border-none [&>tr:first-child>td]:pt-3 [&>tr>td:first-child]:pl-0 [&>tr>td:last-child]:pr-0">
                  {ingredients_field.state.value?.map((_, index) => (
                    <tr key={index} className="*:pb-4 *:align-top">
                      <td>
                        <group.AppField
                          name={`ingredients[${index}].name`}
                          children={(field) => (
                            <field.TextField
                              onBlur={() => ingredients_field.handleBlur()}
                            />
                          )}
                        />
                      </td>
                      <td>
                        <group.AppField
                          name={`ingredients[${index}].quantity`}
                          children={(field) => (
                            <field.NumberField
                              value={field.state.value}
                              min="0"
                              step="0.01"
                              onBlur={() => ingredients_field.handleBlur()}
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
                          children={(field) => (
                            <field.TextField
                              onBlur={() => ingredients_field.handleBlur()}
                            />
                          )}
                        />
                      </td>
                      <td className="align-top">
                        <button
                          type="button"
                          onClick={() => ingredients_field.removeValue(index)}
                          className="btn text-red-700 btn-ghost hover:border-red-50 hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr
                    className="*:align-top"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        ingredients_field.handleBlur();
                      }
                    }}
                  >
                    <td>
                      <Popover.Root
                        open={isPopoverOpen}
                        onOpenChange={setPopoverOpen}
                      >
                        <Popover.Anchor className="flex">
                          <form.AppField
                            name="name"
                            children={(field) => (
                              <Popover.Trigger className="flex-1">
                                <field.TextField
                                  data-ingredient-input
                                  value={field.state.value}
                                  onChange={(e) => {
                                    field.handleChange(e.target.value);
                                  }}
                                  autoComplete="off"
                                  className={cn(
                                    !ingredients_field.state.meta.isValid &&
                                      'input-error',
                                    !field.state.meta.isValid && 'input-error',
                                  )}
                                />
                              </Popover.Trigger>
                            )}
                          />
                        </Popover.Anchor>
                        <Popover.Content
                          className=""
                          side="top"
                          sideOffset={8}
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          {ingredients_search_results?.data &&
                            ingredients_search_results.data.length > 0 && (
                              <div className="z-50 flex rounded-sm border border-solid border-base-300 bg-base-100 p-1">
                                <div className="max-h-40 overflow-y-auto">
                                  <InfiniteScroll
                                    data="ingredients_search_results"
                                    preserveUrl
                                  >
                                    {ingredients_search_results.data.map(
                                      (ingredient) => (
                                        <div
                                          key={ingredient.id}
                                          className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-base hover:bg-base-200"
                                          onClick={() => {
                                            form.setFieldValue(
                                              'name',
                                              ingredient.name,
                                            );
                                            setPopoverOpen(false);
                                          }}
                                        >
                                          {ingredient.name}
                                        </div>
                                      ),
                                    )}
                                  </InfiniteScroll>
                                </div>
                              </div>
                            )}
                        </Popover.Content>
                      </Popover.Root>
                    </td>

                    <td>
                      <form.AppField
                        name="quantity"
                        validators={{
                          onChange:
                            recipeIngredientRequestSchema.shape.quantity,
                          onBlur: recipeIngredientRequestSchema.shape.quantity,
                        }}
                        children={(field) => (
                          <field.NumberField
                            value={field.state.value}
                            min="0"
                            step="0.01"
                            className={cn(
                              !ingredients_field.state.meta.isValid &&
                                'input-error',
                              !field.state.meta.isValid && 'input-error',
                            )}
                            onBlur={(e) => e.preventDefault()}
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
                        children={(field) => (
                          <field.TextField
                            onBlur={(e) => e.preventDefault()}
                            className={cn(
                              !ingredients_field.state.meta.isValid &&
                                'input-error',
                              !field.state.meta.isValid && 'input-error',
                            )}
                          />
                        )}
                      />
                    </td>
                    {ingredients_field.state.value &&
                      ingredients_field.state.value.length !== 0 && <td></td>}
                  </tr>
                </tbody>
              </table>

              <FieldInfo />
              <form.Subscribe>
                {(state) => (
                  <button
                    type="button"
                    disabled={!state.canSubmit}
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                      ingredients_field.setErrorMap({
                        onBlur: undefined,
                        onSubmit: undefined,
                      });
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="btn w-fit border-secondary/20 pl-6.5 btn-soft btn-secondary"
                  >
                    <span>
                      {t('recipes.ingredients.addButton', 'Add ingredient')}
                    </span>
                    <PlusIcon className="h-5 shrink-0 pt-[2px]" />
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
