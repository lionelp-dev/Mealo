import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Info notice shown in "empty" recipe surfaces (recipes index, meal-plan dialog)
 * while a new user's starter pack of recipes is still being generated in the
 * background. Renders nothing when no generation is in progress so the parent
 * can fall back to its usual empty state.
 */
export function StarterRecipesNotice() {
  const { t } = useTranslation();
  const { starterRecipes } = usePage<SharedData>().props;

  if (!starterRecipes?.generating) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="relative flex items-center justify-center">
        <span className="loading loading-lg loading-spinner text-secondary" />
        <ChefHat className="absolute h-5 w-5 text-secondary" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-secondary">
          {t('recipes.generating.noticeTitle', 'Vos recettes arrivent…')}
        </h3>
        <p className="max-w-md text-muted-foreground">
          {t(
            'recipes.generating.noticeDescription',
            'Nous préparons vos premières recettes personnalisées. Elles apparaîtront ici automatiquement dans quelques instants.',
          )}
        </p>
      </div>
    </div>
  );
}
