import RecipeDetailPanel from './recipe-detail-panel';
import { Typography } from '@/app/components/Typography';
import { RecipeResource } from '@/app/data/resources/recipe/types';

type Props = {
  recipe: RecipeResource | null;
  onCloseRecipe: () => void;
};

export function RecipeDetailsPanel({ recipe, onCloseRecipe }: Props) {
  if (recipe) {
    return (
      <div className="absolute inset-0 z-20 min-h-0 bg-base-100 shadow-2xl lg:contents">
        <RecipeDetailPanel
          recipe={recipe}
          onClose={onCloseRecipe}
          showDesktopCloseButton={false}
        />
      </div>
    );
  }

  return (
    <section className="hidden min-h-64 items-center justify-center px-6 py-12 text-center lg:flex">
      <div>
        <Typography as="p" variant="body" weight="semibold">
          Choisissez une recette
        </Typography>
        <Typography as="p" variant="body-sm" tone="muted" className="mt-2">
          Sélectionnez une recette dans votre carnet pour voir ses détails.
        </Typography>
      </div>
    </section>
  );
}
