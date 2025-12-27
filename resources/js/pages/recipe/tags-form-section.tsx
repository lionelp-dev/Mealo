import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { cn } from '@/lib/utils';
import { tagSchema } from '@/schemas/recipe.schema';
import { useTagSearchStore } from '@/stores/tag-search';
import { Recipe, Tag } from '@/types';
import { InfiniteScroll } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const defaultValues: Pick<Recipe, 'tags'> = {
  tags: [],
};

const TagsFormSection = withFieldGroup({
  defaultValues,
  props: {
    tags_search_results: { data: [] as Tag[] },
  },
  render: function Render({ group, tags_search_results }) {
    const { t } = useTranslation();

    const {
      searchTerm,
      setSearchTerm,
      triggerSearch,
      isSearching,
      setIsSearching,
    } = useTagSearchStore();

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialRender = useRef(true);

    const form = useAppForm({
      defaultValues: { name: '' },
      validators: {
        onSubmit: tagSchema,
      },
      onSubmit: ({ value }) => {
        group.pushFieldValue('tags', value);
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
                'input[data-tag-input]',
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

    const addExistingTag = (tag: Tag) => {
      group.pushFieldValue('tags', { name: tag.name });
      setSearchTerm('');
    };

    return (
      <group.AppField
        name="tags"
        mode="array"
        children={(tags_field) => (
          <div className="flex flex-col gap-4">
            <span className="text-md text-base-content">
              {t('recipes.form.tagsTitle')}
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
                            <field.InputField
                              className="-mb-1 w-full py-2 outline outline-base-300"
                              data-tag-input
                              value={searchTerm || field.state.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.handleChange(value);
                                setSearchTerm(value);
                              }}
                              placeholder={t('recipes.tags.namePlaceholder')}
                              autoComplete="off"
                            />
                          </div>
                          {tags_field.state.value.length > 0 && (
                            <div className="max-h-[6lh] overflow-y-scroll">
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
                              {tags_search_results.data.map((tag) => (
                                <div
                                  key={tag.id}
                                  className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-base-300"
                                  onClick={() => addExistingTag(tag)}
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
                    disabled={!state.canSubmit || isSearching}
                    className="btn w-fit"
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                  >
                    <Plus size={16} />
                    Ajouter un tag
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

export default TagsFormSection;
