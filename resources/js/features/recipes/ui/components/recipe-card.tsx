import {
  deleteRecipes,
  editRecipe,
  viewRecipe,
} from '../../infrastructure/repositories/recipes.repository';
import { useRecipesMultiSelectStore } from '../../infrastructure/stores/use-recipes-multi-select-store';
import { useRecipesFiltersStore } from '@/shared/stores/recipes-filters-store';
import { Recipe } from '@/types';
import * as Popover from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: Props) {
  const { t } = useTranslation();

  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const { isFilterActive } = useRecipesFiltersStore();
  const { isMultiSelectMode, selectedRecipeIds, toggleRecipeSelection } =
    useRecipesMultiSelectStore();

  return (
    <div
      onClick={
        isMultiSelectMode
          ? () => toggleRecipeSelection(recipe.id)
          : (e) => {
              e.stopPropagation();
              viewRecipe(recipe.id);
            }
      }
      className={`card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl ${!isMultiSelectMode && 'hover:[&_.recipe-card-actions-btn]:visible'}`}
    >
      <div className="relative">
        {isMultiSelectMode && (
          <input
            className="radio absolute top-4 right-4 border-base-300 bg-base-100/85 radio-sm checked:border-secondary checked:text-secondary"
            type="checkbox"
            checked={selectedRecipeIds.includes(recipe.id)}
            onChange={() => {
              toggleRecipeSelection(recipe.id);
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
          />
        )}
        <div className="absolute top-0 right-0 left-0 flex justify-end gap-2 p-4">
          <Popover.Root open={openPopover} onOpenChange={setOpenPopover}>
            <Popover.Trigger asChild>
              <button
                className="recipe-card-actions-btn btn invisible btn-circle bg-secondary/15 btn-soft btn-sm btn-secondary hover:bg-secondary hover:text-secondary-content"
                disabled={isMultiSelectMode}
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisVertical size={14} className="rotate-90" />
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
                <ul className="flex flex-col gap-1 [&>button]:flex [&>button]:items-center [&>button]:justify-center">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewRecipe(recipe.id);
                    }}
                  >
                    <li>{t('common.buttons.view', 'View')}</li>
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      editRecipe(recipe.id);
                    }}
                  >
                    <li>{t('common.buttons.edit', 'Edit')}</li>
                  </button>
                  <button
                    className="btn items-end justify-start gap-2 rounded-md text-error btn-ghost btn-sm hover:border-error/10 hover:bg-error/10"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setOpenPopover(false);
                      deleteRecipes([recipe]);
                    }}
                  >
                    <li>{t('common.buttons.delete', 'Delete')}</li>
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
          <figure className="flex h-42 items-center justify-center bg-secondary/15"></figure>
        )}

        <div className="absolute right-0 bottom-0 left-0 flex max-h-[1.5lh] flex-wrap justify-start gap-2 overflow-hidden px-2 py-2">
          {recipe.meal_times.map((meal_time) => (
            <span
              key={meal_time.id}
              className={`badge bg-base-100/70 badge-sm whitespace-nowrap text-base-content ${isFilterActive({ type: 'meal_time', value: meal_time.id.toString() }) && 'bg-secondary/80 text-secondary-content'}`}
            >
              {t(
                `mealPlanning.dialog.filters.${meal_time.name}`,
                meal_time.name,
              )}
            </span>
          ))}
          {recipe.tags.map((tag) => (
            <span
              key={tag.id}
              className={`badge bg-base-100/80 badge-sm whitespace-nowrap text-base-content ${tag.id && isFilterActive({ type: 'tag', value: tag.id.toString() }) && 'bg-secondary/80 text-secondary-content'}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <div className="card-body">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="card-title block truncate text-base-content">
            {recipe.name}
          </span>
          <span className="line-clamp-2 text-base-content/70">
            {recipe.description}
          </span>
        </div>
      </div>
    </div>
  );
}
