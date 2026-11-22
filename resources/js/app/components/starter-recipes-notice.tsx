import { Typography } from '@/app/components/Typography';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Generation status for a new user's starter pack. The parent decides when the
 * notice is relevant, which lets empty states and populated recipe lists use
 * the same status without coupling this component to Inertia page props.
 */
type StarterRecipesNoticeProps = {
  variant?: 'empty' | 'inline';
};

export function StarterRecipesNotice({
  variant = 'empty',
}: StarterRecipesNoticeProps) {
  const { t } = useTranslation();

  if (variant === 'inline') {
    return (
      <div
        role="status"
        className="flex items-center gap-2 px-3 py-2 text-sm text-secondary"
      >
        <span className="loading loading-sm loading-spinner" />
        <Typography as="span" variant="body-sm" tone="inherit">
          {t('recipes.generating.noticeTitle', 'Vos recettes arrivent…')}
        </Typography>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 py-8 text-center"
    >
      <div className="relative flex items-center justify-center">
        <span className="loading loading-lg loading-spinner text-secondary" />
        <ChefHat className="absolute h-5 w-5 text-secondary" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Typography as="h3" variant="title" tone="secondary">
          {t('recipes.generating.noticeTitle', 'Vos recettes arrivent…')}
        </Typography>
        <Typography as="p" variant="body" tone="muted" className="max-w-md">
          {t(
            'recipes.generating.noticeDescription',
            'Nous préparons vos premières recettes personnalisées. Elles apparaîtront ici automatiquement dans quelques instants.',
          )}
        </Typography>
      </div>
    </div>
  );
}
