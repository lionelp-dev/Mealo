import { Typography } from '@/app/components/Typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { RecipeResource } from '@/app/data/resources/recipe/types';
import { Check, EllipsisVertical, ImageOff, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  recipe: RecipeResource;
  isSelected: boolean;
  isRecentlyAdded: boolean;
  isMultiSelectMode: boolean;
  isChecked: boolean;
  onActivate: () => void;
  onToggleSelection: () => void;
  onStartMultiSelect: () => void;
};

export function RecipeListItem({
  recipe,
  isSelected,
  isRecentlyAdded,
  isMultiSelectMode,
  isChecked,
  onActivate,
  onToggleSelection,
  onStartMultiSelect,
}: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
        isSelected ? 'bg-base-200/75' : 'hover:bg-base-200/45'
      }`}
    >
      <button
        type="button"
        aria-pressed={isMultiSelectMode ? isChecked : isSelected}
        onClick={isMultiSelectMode ? onToggleSelection : onActivate}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt=""
            className="h-25 w-35 shrink-0 rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/35">
            <ImageOff size={18} aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <Typography
            as="span"
            variant="body-sm"
            tone="inherit"
            className="flex items-center gap-2"
          >
            <Typography
              as="span"
              variant="body"
              tone="inherit"
              className="truncate"
            >
              {recipe.name}
            </Typography>
            {isRecentlyAdded && (
              <Typography
                as="span"
                variant="body-sm"
                weight="semibold"
                tone="inherit"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-1"
              >
                <Check size={12} aria-hidden="true" />
                {t('recipes.index.recentlyAdded', 'Added')}
              </Typography>
            )}
          </Typography>
          <Typography
            as="span"
            variant="body-sm"
            tone="inherit"
            className="mt-1 flex flex-wrap gap-1.5"
          >
            {recipe.meal_times.map((mealTime) => (
              <Typography
                as="span"
                variant="body-sm"
                key={mealTime.id}
                tone="inherit"
                className="badge"
              >
                {t(
                  `mealPlanning.dialog.filters.${mealTime.slug}`,
                  mealTime.name,
                )}
              </Typography>
            ))}
          </Typography>
        </span>
      </button>
      {isMultiSelectMode ? (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggleSelection}
          aria-label={t('recipes.index.selectRecipe', {
            defaultValue: `Select ${recipe.name}`,
            recipeName: recipe.name,
          })}
          className="checkbox shrink-0 checkbox-sm checkbox-secondary"
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="btn btn-square shrink-0 btn-ghost btn-sm"
              aria-label={t('recipes.actions.openMenu', 'Open recipe menu')}
            >
              <EllipsisVertical size={18} aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={onStartMultiSelect}
            >
              <Trash2Icon size={14} aria-hidden="true" />
              {t('common.buttons.delete', 'Delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
