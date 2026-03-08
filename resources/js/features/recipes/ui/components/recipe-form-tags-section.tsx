import { tagSchema, recipeSchema } from '../../domain/recipe.schema';
import { useRecipesContextValue } from '../../infrastructure/inertia.adapter';
import { searchTags } from '../../infrastructure/repositories/recipes.repository';
import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { cn } from '@/lib/utils';
import { Recipe, Tag } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { PlusIcon, X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceValue } from 'usehooks-ts';

const defaultValues: Pick<Recipe, 'tags'> = {
  tags: [],
};

export const RecipeFormTagsSection = withFieldGroup({
  defaultValues,
  render: function Render({ group }) {
    const { t } = useTranslation();

    const { url, tags_search_results } = useRecipesContextValue();

    const form = useAppForm({
      defaultValues: { name: '' },
      validators: {
        onSubmit: tagSchema,
      },
      onSubmit: ({ value }) => {
        group.pushFieldValue('tags', value);
        form.reset();
      },
    });

    const [debouncedValue, setSearchTerm] = useDebounceValue('', 300);

    useEffect(() => {
      if (debouncedValue) {
        searchTags({
          url,
          term: debouncedValue,
        });
      }
    }, [debouncedValue]);

    return (
      <group.AppField
        name="tags"
        mode="array"
        validators={{
          onChange: recipeSchema.shape.tags,
          onBlur: recipeSchema.shape.tags,
        }}
        children={(tags_field) => (
          <div className="flex flex-col gap-4">
            <span className="text-base text-base-content">
              {t('recipes.form.tagsTitle', 'Tags')}
            </span>

            <div className="flex flex-col gap-6">
              <Popover.Root>
                <Popover.Anchor className="flex flex-1">
                  <form.AppField
                    name="name"
                    children={(field) => (
                      <Popover.Trigger className="flex-1">
                        <label
                          className={cn(
                            `${tags_field.state.value.length > 0 && 'input pt-2 pr-4 pb-4 pl-3'}`,
                            'flex h-fit w-full flex-col items-start gap-4 text-left [&>div:first-of-type]:w-full',
                          )}
                        >
                          <div
                            className={`${tags_field.state.value.length > 0 && 'py-2'}`}
                          >
                            <field.TextField
                              className={cn(
                                '-mb-1 w-full py-2',
                                tags_field.state.value.length > 0 &&
                                  'outline outline-base-300',
                                !tags_field.state.meta.isValid && 'input-error',
                                !field.state.meta.isValid && 'input-error',
                              )}
                              data-tag-input
                              value={field.state.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.handleChange(value);
                                setSearchTerm(value);
                              }}
                              onBlur={() => tags_field.handleBlur()}
                              placeholder={t(
                                'recipes.tags.namePlaceholder',
                                'Tag name',
                              )}
                              autoComplete="off"
                            />
                          </div>
                          {tags_field.state.value.length > 0 && (
                            <div className="max-h-40 overflow-y-scroll">
                              <div className="flex flex-wrap gap-3">
                                {tags_field.state.value.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="badge flex cursor-pointer content-center badge-secondary"
                                    onClick={() =>
                                      tags_field.removeValue(index)
                                    }
                                  >
                                    <span className="text-secondary-content">
                                      {tag.name}
                                    </span>
                                    <X size={14} />
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </label>
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
                    {tags_search_results?.data &&
                      tags_search_results.data.length > 0 && (
                        <div className="z-50 flex rounded-sm border border-solid border-base-300 bg-base-100 p-1">
                          <div className="h-[10lh] overflow-y-auto">
                            <InfiniteScroll
                              data="tags_search_results"
                              preserveUrl
                            >
                              {tags_search_results.data.map((tag: Tag) => (
                                <div
                                  key={tag.id}
                                  className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-base-300"
                                  onClick={() =>
                                    form.setFieldValue('name', tag.name)
                                  }
                                >
                                  <span className="font-medium">
                                    {tag.name}
                                  </span>
                                </div>
                              ))}
                            </InfiniteScroll>
                          </div>
                        </div>
                      )}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <FieldInfo />

              <form.Subscribe>
                {(state) => (
                  <button
                    disabled={!state.canSubmit}
                    className="btn w-fit border-secondary/20 pl-6.5 btn-soft btn-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                  >
                    {t('recipes.tags.addButton', 'Add tag')}
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
