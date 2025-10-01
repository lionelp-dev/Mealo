import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { tagSchema } from '@/schemas/recipe.schema';
import { PaginatedCollection, RecipeFormInput, Tag } from '@/types';
import { usePage } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { Plus } from 'lucide-react';

const defaultValues: Pick<RecipeFormInput, 'tags'> = {
  tags: [],
};

type PageProps = {
  tags: PaginatedCollection<Tag>;
};

const TagsFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: 'Tags',
  },
  render: function Render({ group, title }) {
    const { tags } = usePage<PageProps>().props;

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

    return (
      <group.AppField
        name="tags"
        mode="array"
        children={(field) => (
          <div className="flex flex-col gap-2">
            <span className="text-md">{title}</span>

            <div className="flex flex-col gap-3">
              <Popover.Root>
                <Popover.Anchor className="flex flex-col gap-3">
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
                  <form.AppField
                    name="name"
                    children={(field) => (
                      <Popover.Trigger className="flex-1">
                        <field.InputField placeholder="Ajouter un tag" />
                      </Popover.Trigger>
                    )}
                  />
                </Popover.Anchor>
                <Popover.Portal>
                  <Popover.Content
                    className="rounded-sm border border-solid border-gray-200 bg-white p-4"
                    side="top"
                    sideOffset={8}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="grid max-h-[5lh] grid-cols-3 overflow-y-scroll">
                      {tags.data.map((tag) => (
                        <div
                          key={tag.id}
                          className="cursor-pointer rounded-xs px-2 hover:bg-gray-100"
                          onClick={() => field.pushValue({ name: tag.name })}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <FieldInfo />

              <form.Subscribe>
                {(state) => (
                  <button
                    disabled={!state.canSubmit || state.isSubmitting}
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
          </div>
        )}
      />
    );
  },
});

export default TagsFormSection;
