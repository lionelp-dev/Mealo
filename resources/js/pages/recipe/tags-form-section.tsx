import FieldInfo from '@/components/ui/form-field-info';
import { useAppForm, withFieldGroup } from '@/hooks/form-hook';
import { tagSchema } from '@/schemas/recipe.schema';
import { RecipeFormInput } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { Plus } from 'lucide-react';

const defaultValues: Pick<RecipeFormInput, 'tags'> = {
  tags: [],
};

const TagsFormSection = withFieldGroup({
  defaultValues,
  props: {
    title: 'Tags',
  },
  render: function Render({ group, title }) {
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

              <Popover.Root>
                <form.AppField
                  name="name"
                  children={(field) => (
                    <Popover.Trigger className="flex-1">
                      <field.InputField placeholder="Ajouter un tag" />
                    </Popover.Trigger>
                  )}
                />
                <Popover.Portal>
                  <Popover.Content
                    className="rounded-sm bg-white p-4"
                    side="top"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <Popover.Close />
                    <Popover.Arrow />
                    Existing tags:
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
