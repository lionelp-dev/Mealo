import {
  viewRecipe,
  editRecipe,
  deleteRecipes,
} from '../repositories/recipes.repository';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRecipesFiltersStore } from '@/shared/stores/recipes-filters-store';
import { Recipe } from '@/types';
import { Edit2Icon, EllipsisVertical, EyeIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="recipe-card-actions-btn btn invisible btn-circle bg-white/60 text-black backdrop-blur-sm btn-soft btn-sm btn-secondary hover:bg-secondary hover:text-secondary-content"
                disabled={isMultiSelectMode}
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisVertical size={16} className="rotate-90" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={8}
              onMouseLeave={() => setIsOpen(false)}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  viewRecipe(recipe.id);
                }}
              >
                <EyeIcon size={14} />
                {t('common.buttons.view', 'View')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  editRecipe(recipe.id);
                }}
              >
                <Edit2Icon size={14} />
                {t('common.buttons.edit', 'Edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRecipes([recipe]);
                }}
              >
                <Trash2Icon size={14} />
                {t('common.buttons.delete', 'Delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
