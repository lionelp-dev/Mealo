import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { ingredientSchema } from '@/schemas/recipe.schema';
import { useIngredientSearchStore } from '@/stores/ingredient-search';
import { Ingredient, Recipe } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const defaultValues: Pick<Recipe, 'ingredients'> = {
  ingredients: [],
};

const IngredientFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: '', // Title will be passed from parent component
    ingredients_search_results: { data: [] as Ingredient[] },
  },
  render: function Render({ group, title, ingredients_search_results }) {
    const {
      searchTerm,
      setSearchTerm,
      triggerSearch,
      isSearching,
      setIsSearching,
    } = useIngredientSearchStore();

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialRender = useRef(true);

    const { t } = useTranslation();
    const form = useAppForm({
      defaultValues: {
        name: '',
        quantity: 0,
        unit: '',
      },
      validators: {
        onSubmit: ingredientSchema,
      },
      onSubmit: ({ value }) => {
        group.pushFieldValue('ingredients', value);
        form.reset();
        setSearchTerm('');
      },
    });

    useEffect(() => {
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        triggerSearch({
          onBefore: () => setIsSearching(true),
          onFinish: () => {
            setIsSearching(false);
            setTimeout(() => {
              const searchInput = document.querySelector(
                'input[data-ingredient-input]',
              ) as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
            }, 100);
          },
        });
      }, 300);

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, [searchTerm]);

    const addExistingIngredient = (ingredient: Ingredient) => {
      form.setFieldValue('name', ingredient.name);
      setSearchTerm('');
    };

    return (
      <group.AppField
        name="ingredients"
        mode="array"
        children={(field) => (
          <div className="flex flex-col gap-4">
            <span className="font-medium text-base-content">{title}</span>

            <table className="table -mb-1 w-full table-xs">
              <thead>
                <tr className="[&>th]:pb-1 [&>th]:font-normal [&>th]:text-base-content">
                  <th className="w-[60%]">
                    {t('recipes.ingredients.nameLabel')}
                  </th>
                  <th className="w-[15%]">
                    {t('recipes.ingredients.quantityLabel')}
                  </th>
                  <th className="w-[15%]">
                    {t('recipes.ingredients.unitLabel')}
                  </th>
                  {field.state.value.length !== 0 && (
                    <th className="w-[10%]">{t('recipes.table.actions')}</th>
                  )}
                </tr>
              </thead>
              <tbody className="*:border-none [&>tr:first-child>td]:pt-2 [&>tr>td:first-child]:pl-0 [&>tr>td:last-child]:pr-0">
                {field.state.value.map((_, index) => (
                  <tr key={index} className="*:pb-4 *:align-top">
                    <td>
                      <group.AppField
                        name={`ingredients[${index}].name`}
                        children={(field) => <field.InputField />}
                      />
                    </td>
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
                    <Popover.Root>
                      <Popover.Anchor className="flex">
                        <form.AppField
                          name="name"
                          children={(field) => (
                            <Popover.Trigger className="flex-1">
                              <field.InputField
                                data-ingredient-input
                                value={searchTerm || field.state.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.handleChange(value);
                                  setSearchTerm(value);
                                }}
                                autoComplete="off"
                              />
                            </Popover.Trigger>
                          )}
                        />
                      </Popover.Anchor>
                      <Popover.Portal>
                        <Popover.Content
                          className=""
                          side="top"
                          sideOffset={8}
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          {ingredients_search_results?.data &&
                            ingredients_search_results.data.length > 0 && (
                              <div className="z-50 flex rounded-sm border border-solid border-base-300 bg-base-100 p-4">
                                <div className="h-[10lh] overflow-y-auto">
                                  <InfiniteScroll
                                    data="ingredients_search_results"
                                    preserveUrl
                                  >
                                    {ingredients_search_results.data.map(
                                      (ingredient) => (
                                        <div
                                          key={ingredient.id}
                                          className="flex cursor-pointer items-center justify-between rounded px-3 py-2 hover:bg-base-200"
                                          onClick={() =>
                                            addExistingIngredient(ingredient)
                                          }
                                        >
                                          <span className="font-medium">
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
                      </Popover.Portal>
                    </Popover.Root>
                  </td>

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
                  {field.state.value.length !== 0 && <td></td>}
                </tr>
              </tbody>
            </table>

            <FieldInfo />
            <form.Subscribe>
              {(state) => (
                <button
                  type="button"
                  disabled={!state.canSubmit || isSearching}
                  onClick={() => {
                    form.handleSubmit();
                  }}
                  className="btn w-fit whitespace-nowrap btn-secondary"
                >
                  <Plus size={16} /> {t('recipes.ingredients.addButton')}
                </button>
              )}
            </form.Subscribe>
          </div>
        )}
      />
    );
  },
});

export default IngredientFormSection;
