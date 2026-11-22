import { editRecipe } from '../repositories/recipes.repository';
import { useDeleteRecipes } from '../repositories/use-delete-recipes';
import { useRecipesMultiSelectStore } from '../stores/use-recipes-multi-select-store';
import { Typography } from '@/app/components/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { useRecipesFiltersStore } from '@/app/stores/recipes-filters-store';
import { Edit2Icon, EllipsisVertical, EyeIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  recipe: RecipeResource;
  onViewRecipe: (recipe: RecipeResource) => void;
};

export function RecipeCard({ recipe, onViewRecipe }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { deleteRecipes, processing } = useDeleteRecipes();
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
              onViewRecipe(recipe);
            }
      }
      className={`card cursor-pointer overflow-hidden rounded-md bg-base-100 shadow-lg transition-shadow card-sm hover:shadow-xl ${!isMultiSelectMode && 'hover:[&_.recipe-card-actions-btn]:visible'}`}
    >
      <div className="relative">
        {isMultiSelectMode && (
          <input
            className="radio absolute top-4 right-4 z-10 border-base-300 bg-base-100/85 radio-sm checked:border-secondary checked:text-secondary"
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
        <div
          className={`absolute top-0 right-0 left-0 flex justify-end gap-2 p-4 ${
            isMultiSelectMode ? 'pointer-events-none' : ''
          }`}
        >
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
                  onViewRecipe(recipe);
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
                disabled={processing}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRecipes({ ids: [recipe.id] });
                }}
              >
                <Trash2Icon size={14} />
                {t('common.buttons.delete', 'Delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {recipe.image_url ? (
          <figure className="relative h-42">
            {!imageLoaded && (
              <div className="absolute inset-0 h-full w-full skeleton rounded-none" />
            )}
            <img
              src={recipe.image_url}
              alt={recipe.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ) : (
          <figure className="flex h-42 items-center justify-center bg-secondary/15"></figure>
        )}

        <div className="absolute right-0 bottom-0 left-0 flex max-h-[1.5lh] flex-wrap justify-start gap-2 overflow-hidden px-2 py-2">
          {recipe.meal_times?.map((meal_time) => (
            <Typography
              as="span"
              variant="body-sm"
              key={meal_time.id}
              tone={
                isFilterActive({
                  type: 'meal_time',
                  value: meal_time.id.toString(),
                })
                  ? 'inverse'
                  : 'default'
              }
              className={`badge bg-base-100/70 badge-sm whitespace-nowrap ${isFilterActive({ type: 'meal_time', value: meal_time.id.toString() }) && 'bg-secondary/80'}`}
            >
              {t(
                `mealPlanning.dialog.filters.${meal_time.slug}`,
                meal_time.name,
              )}
            </Typography>
          ))}
          {recipe.tags?.map((tag) => (
            <Typography
              as="span"
              variant="body-sm"
              key={tag.id}
              tone={
                tag.id &&
                isFilterActive({ type: 'tag', value: tag.id.toString() })
                  ? 'inverse'
                  : 'default'
              }
              className={`badge bg-base-100/80 badge-sm whitespace-nowrap ${tag.id && isFilterActive({ type: 'tag', value: tag.id.toString() }) && 'bg-secondary/80'}`}
            >
              {tag.name}
            </Typography>
          ))}
        </div>
      </div>

      <div className="card-body">
        <div className="flex min-w-0 flex-col gap-1">
          <Typography
            as="span"
            variant="body-sm"
            className="card-title block truncate"
          >
            {recipe.name}
          </Typography>
          <Typography
            as="span"
            variant="body-sm"
            tone="muted"
            className="line-clamp-2"
          >
            {recipe.description}
          </Typography>
        </div>
      </div>
    </div>
  );
}
