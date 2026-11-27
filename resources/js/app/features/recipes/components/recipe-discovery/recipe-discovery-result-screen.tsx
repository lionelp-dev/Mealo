import { DiscoveredRecipe } from '../../types/discovery';
import { Typography } from '@/app/components/Typography';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import {
  Clock3,
  LoaderCircle,
  Plus,
  Settings2,
  Sparkles,
  UtensilsCrossed,
  WandSparkles,
  X,
} from 'lucide-react';

type Props = {
  recipe: DiscoveredRecipe;
  mealTimes: MealTimeResource[];
  diet: string | null;
  selectedMealTimeSlugs: string[];
  isSaving: boolean;
  error: string | null;
  onRefine: () => void;
  onSave: () => void;
  onSkip: () => void;
  onRetry: () => void;
};

export function RecipeDiscoveryResultScreen({
  recipe,
  mealTimes,
  diet,
  selectedMealTimeSlugs,
  isSaving,
  error,
  onRefine,
  onSave,
  onSkip,
  onRetry,
}: Props) {
  const selectedMealTimes = mealTimes.filter((mealTime) =>
    selectedMealTimeSlugs.includes(mealTime.slug),
  );
  return (
    <section className="h-full min-h-0 flex-1 overflow-y-auto px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6 lg:col-start-2 lg:row-start-1 lg:px-10 lg:py-7">
      <div className="max-w-3xl">
        <DiscoveryModeHeader />
        <Header />
        <div className="mt-5 flex items-center">
          <button
            type="button"
            onClick={onRefine}
            className="btn w-fit gap-2 btn-soft btn-md btn-secondary"
          >
            <Settings2 size={16} /> Modifier les critères
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {diet && <Badge>{diet}</Badge>}
          {selectedMealTimes.map((mealTime) => (
            <Badge key={mealTime.id}>{mealTime.name}</Badge>
          ))}
        </div>
        <div className="relative mx-auto mt-6 max-w-2xl pb-5 sm:mt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-3 bottom-0 rounded-3xl border border-base-300/70 bg-base-100/75 shadow-sm"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2.5 top-1.5 bottom-2 rounded-3xl border border-base-300/70 bg-base-100/85 shadow-sm"
          />
          <article className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl shadow-base-content/10 sm:rounded-3xl">
            <div className="relative">
              {recipe.image_data_url ? (
                <img
                  src={recipe.image_data_url}
                  alt={recipe.name}
                  className="h-56 w-full object-cover sm:h-72 lg:h-80"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-base-200 text-sm text-base-content/50 sm:h-72 lg:h-80">
                  Image indisponible
                </div>
              )}
              <Typography
                as="span"
                variant="body-sm"
                weight="semibold"
                tone="secondary"
                className="absolute top-3 left-3 badge h-8 gap-1.5 border-0 bg-base-100 px-3 shadow-sm"
              >
                <Sparkles size={15} /> Suggestion IA
              </Typography>
            </div>
            <div className="p-5 sm:p-6">
              <Typography
                as="h2"
                variant="heading"
                weight="bold"
                className="truncate"
                title={recipe.name}
              >
                {recipe.name}
              </Typography>
              <div className="mt-3 flex flex-wrap gap-2 text-sm sm:mt-4">
                <MetaBadge>
                  <Clock3 size={15} />
                  {recipe.preparation_time + recipe.cooking_time} min
                </MetaBadge>
                {selectedMealTimes.map((mealTime) => (
                  <MetaBadge key={mealTime.id}>
                    <UtensilsCrossed size={15} />
                    {mealTime.name}
                  </MetaBadge>
                ))}
                <MetaBadge>
                  <Sparkles size={15} /> Suggestion IA
                </MetaBadge>
              </div>
              <Typography
                as="p"
                variant="body-sm"
                tone="muted"
                className="mt-3 line-clamp-3 min-h-[4.5rem] sm:mt-4"
              >
                {recipe.description}
              </Typography>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="btn gap-2 rounded-xl btn-secondary"
                >
                  {isSaving ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                  <Typography
                    as="span"
                    variant="body-sm"
                    tone="inherit"
                    className="sm:hidden"
                  >
                    {isSaving ? 'Ajout…' : 'Ajouter'}
                  </Typography>
                  <Typography
                    as="span"
                    variant="body-sm"
                    tone="inherit"
                    className="max-sm:hidden"
                  >
                    {isSaving ? 'Ajout…' : 'Ajouter au carnet'}
                  </Typography>
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  disabled={isSaving}
                  className="btn gap-2 rounded-xl btn-outline btn-secondary"
                >
                  <X size={18} /> Passer
                </button>
              </div>
            </div>
          </article>
        </div>
        {error && <ErrorState error={error} retry={onRetry} />}
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-1 pt-3 sm:pt-5 lg:pt-0">
      <Typography as="h1" variant="body-2xl" weight="bold" tone="secondary">
        Qu'est-ce qui vous ferait plaisir ?
      </Typography>
      <Typography as="p" variant="body" tone="secondary">
        Laissez vos envies vous inspirer de nouvelles recettes.
      </Typography>
    </header>
  );
}

function DiscoveryModeHeader() {
  return (
    <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <WandSparkles size={24} aria-hidden="true" className="text-secondary" />
      <Typography as="h1" variant="body-2xl" weight="medium" tone="secondary">
        Mode découverte
      </Typography>
      <Typography as="p" variant="body" tone="secondary" className="w-full">
        Explorez des recettes personnalisées avec l’IA et ajoutez vos coups de
        cœur à votre carnet.
      </Typography>
    </header>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      as="span"
      variant="body-sm"
      className="badge badge-soft badge-lg badge-secondary"
    >
      {children}
    </Typography>
  );
}
function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      as="span"
      variant="body-sm"
      weight="medium"
      className="badge h-8 gap-1.5 border-base-300 bg-base-100 px-3"
    >
      {children}
    </Typography>
  );
}
function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div role="alert" className="mt-5 text-sm text-error">
      <Typography as="p" variant="body">
        {error}
      </Typography>
      <button
        type="button"
        onClick={retry}
        className="btn mt-2 btn-link btn-sm"
      >
        Réessayer
      </button>
    </div>
  );
}
