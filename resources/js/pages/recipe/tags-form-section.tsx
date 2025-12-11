import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { tagSchema } from '@/schemas/recipe.schema';
import { useTagSearchStore } from '@/stores/tag-search';
import { PaginatedCollection, Recipe, Tag } from '@/types';
import { InfiniteScroll, usePage } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';

const defaultValues: Pick<Recipe, 'tags'> = {
  tags: [],
};

type PageProps = {
  tags: PaginatedCollection<Tag>;
  tags_search_results: { data: Tag[] };
};

const TagsFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: 'Tags',
  },
  render: function Render({ group, title }) {
    const { tags, tags_search_results } = usePage<PageProps>().props;

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
        children={(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-md">{title}</span>

            <div className="flex flex-col gap-3">
              <div className="flex flex-1 gap-2">
                <Popover.Root>
                  <Popover.Anchor className="flex flex-1">
                    <form.AppField
                      name="name"
                      children={(field) => (
                        <Popover.Trigger className="flex-1">
                          <field.InputField
                            data-tag-input
                            value={searchTerm || field.state.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.handleChange(value);
                              setSearchTerm(value);
                            }}
                            placeholder="Ajouter un tag"
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
                      {tags_search_results?.data &&
                        tags_search_results.data.length > 0 && (
                          <div className="z-50 flex rounded-sm border border-solid border-gray-200 bg-white p-1">
                            <div className="h-[10lh] overflow-y-auto">
                              <InfiniteScroll
                                data="tags_search_results"
                                preserveUrl
                              >
                                {tags_search_results.data.map((tag) => (
                                  <div
                                    key={tag.id}
                                    className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-gray-100"
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
                <form.Subscribe>
                  {(state) => (
                    <button
                      disabled={!state.canSubmit || isSearching}
                      className="btn w-fit btn-accent"
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

              <FieldInfo />

              {field.state.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => field.removeValue(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />
    );
  },
});

export default TagsFormSection;
