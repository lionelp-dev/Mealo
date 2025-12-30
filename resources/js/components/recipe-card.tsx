import recipes from '@/routes/recipes';
import { Recipe } from '@/types';
import { router } from '@inertiajs/react';
import * as Popover from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RecipeCardProps = {
  recipe: Recipe;
  onDelete: (recipe: Recipe) => void;
};

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.reload({ reset: ['flash'] });
    router.visit(recipes.show.url({ recipe: recipe.id }));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.reload({ reset: ['flash'] });
    router.visit(recipes.edit.url({ id: recipe.id }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPopover(false);
    onDelete(recipe);
  };

  return (
    <div
      onClick={handleView}
      className="card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl hover:[&_.recipe-card-actions-btn]:visible"
    >
      <div className="relative">
        <div className="absolute top-0 right-0 left-0 flex justify-end gap-2 p-4">
          <Popover.Root open={openPopover} onOpenChange={setOpenPopover}>
            <Popover.Trigger asChild>
              <button
                className="recipe-card-actions-btn btn invisible btn-circle border-base-300 bg-base-300/80 btn-sm hover:bg-base-200"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisVertical
                  size={14}
                  className="rotate-90 text-base-content/75"
                />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-[10000] rounded-lg border border-base-300 bg-base-100 px-2 py-[6px] shadow-xl"
                side="top"
                align="end"
                sideOffset={8}
                alignOffset={-4}
              >
                <ul className="flex flex-col gap-1 [&>button]:flex [&>button]:items-center [&>button]:justify-end">
                  <button className="btn btn-ghost btn-sm" onClick={handleView}>
                    <li>{t('common.buttons.view')}</li>
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={handleEdit}>
                    <li>{t('common.buttons.edit')}</li>
                  </button>
                  <button
                    className="btn items-end justify-start gap-2 rounded-md text-error btn-ghost btn-sm hover:border-error/10 hover:bg-error/10"
                    onClick={handleDelete}
                  >
                    <li>{t('common.buttons.delete')}</li>
                  </button>
                </ul>
                <Popover.Arrow className="fill-base-100 stroke-base-300" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        {recipe.image_url ? (
          <figure className="h-42">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          </figure>
        ) : (
          <figure className="flex h-42 items-center justify-center bg-base-200"></figure>
        )}

        <div className="absolute right-0 bottom-0 left-0 flex max-h-[1.5lh] flex-wrap justify-start gap-2 overflow-hidden px-2 py-2">
          {recipe.meal_times.map((meal_time) => (
            <span
              key={meal_time.id}
              className="badge bg-base-100/90 badge-sm whitespace-nowrap"
            >
              {meal_time.name}
            </span>
          ))}
          {recipe.tags.map((tag) => (
            <span
              key={tag.id}
              className="badge bg-base-100/80 badge-sm whitespace-nowrap text-base-content"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="card-body">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-base-content">{recipe.name}</h2>
          <p className="line-clamp-2 text-base-content/70">
            {recipe.description}
          </p>
        </div>
      </div>
    </div>
  );
}
