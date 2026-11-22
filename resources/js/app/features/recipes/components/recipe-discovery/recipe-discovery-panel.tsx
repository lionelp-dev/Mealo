import { useRecipeDiscovery } from '../../hooks/use-recipe-discovery';
import { RecipeFormCard } from '../recipe-form-card';
import { Typography } from '@/app/components/Typography';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import {
  Clock3,
  CookingPot,
  Leaf,
  LoaderCircle,
  Plus,
  Settings2,
  Sparkles,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  onSaved: (id: string) => void;
  onPendingChange: (count: number) => void;
  onGeneratingChange: (value: boolean) => void;
  onPreparationChange: (value: boolean) => void;
  mealTimes: MealTimeResource[];
};

const dietOptions = [
  'Végétarien',
  'Végan',
  'Sans gluten',
  'Sans produits laitiers',
];
const styleOptions = [
  'Équilibré',
  'Cuisine du monde',
  'Repas familial',
  'Plats réconfortants',
  'Recettes légères',
];

export function RecipeDiscoveryPanel(props: Props) {
  const discovery = useRecipeDiscovery(props);
  const isLoading = discovery.isGenerating || discovery.isPrefetching;

  if (!discovery.currentRecipe || discovery.isRefining) {
    return (
      <section className="h-full min-h-0 flex-1 overflow-y-auto px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6 lg:col-start-2 lg:row-start-1 lg:px-10 lg:py-7">
        <div className="max-w-3xl">
          <DiscoveryHeader />
          {isLoading ? (
            <LoadingState />
          ) : (
            <form
              className="mt-6 space-y-6 sm:mt-8 sm:space-y-7"
              onSubmit={(event) => {
                event.preventDefault();
                discovery.generate();
              }}
            >
              <RecipeFormCard className="gap-0">
                <Typography
                  as="label"
                  variant="body"
                  weight="semibold"
                  tone="secondary"
                >
                  Qu’avez-vous envie de manger ?{' '}
                  <Typography
                    as="span"
                    variant="body-sm"
                    weight="regular"
                    tone="muted"
                  >
                    (requis)
                  </Typography>
                </Typography>
                <textarea
                  id="discovery-prompt"
                  value={discovery.prompt}
                  onChange={(event) => discovery.setPrompt(event.target.value)}
                  placeholder="Ex. un dîner végétarien gourmand, un plat rapide pour la semaine…"
                  className="textarea-bordered textarea mt-2 min-h-28 w-full rounded-xl bg-base-100 p-4 sm:min-h-32"
                />
                <PreferenceGroup
                  label="Besoin d’inspiration ?"
                  options={styleOptions}
                  selected={discovery.style}
                  onSelect={discovery.selectStyle}
                  showOptional={false}
                />
              </RecipeFormCard>
              <RecipeFormCard className="gap-0">
                <MealTimesCheckboxGroup
                  mealTimes={props.mealTimes}
                  selected={discovery.selectedMealTimes}
                  onToggle={discovery.toggleMealTime}
                />
                <PreferenceGroup
                  label="Alimentation"
                  icon={Leaf}
                  options={dietOptions}
                  selected={discovery.diet}
                  onSelect={discovery.selectDiet}
                />
              </RecipeFormCard>
              <button
                type="submit"
                disabled={discovery.prompt.trim().length < 3}
                className="btn w-full gap-2 rounded-xl btn-md btn-secondary max-md:btn-sm"
              >
                <Sparkles size={18} />
                {discovery.isRefining
                  ? 'Mettre à jour les suggestions'
                  : 'Explorez de nouvelles recettes avec l’IA'}
              </button>
            </form>
          )}
          {discovery.error && (
            <ErrorState error={discovery.error} retry={discovery.retry} />
          )}
        </div>
      </section>
    );
  }

  const recipe = discovery.currentRecipe;
  return (
    <section className="h-full min-h-0 flex-1 overflow-y-auto px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6 lg:col-start-2 lg:row-start-1 lg:px-10 lg:py-7">
      <div className="max-w-3xl">
        <DiscoveryHeader />
        <div className="mt-5 flex items-center">
          <button
            type="button"
            onClick={() => discovery.setIsRefining(true)}
            className="btn w-fit gap-2 btn-soft btn-md btn-secondary max-md:btn-sm"
          >
            <Settings2 size={16} /> Modifier les critères
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {discovery.diet && (
            <Typography
              as="span"
              variant="body-sm"
              className="badge badge-soft badge-lg badge-secondary"
            >
              {discovery.diet}
            </Typography>
          )}
          {props.mealTimes
            .filter((mealTime) =>
              discovery.selectedMealTimes.includes(mealTime.slug),
            )
            .map((mealTime) => (
              <Typography
                as="span"
                variant="body-sm"
                key={mealTime.id}
                className="badge badge-soft badge-lg badge-secondary"
              >
                {mealTime.name}
              </Typography>
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
                <Sparkles size={15} aria-hidden="true" /> Suggestion IA
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
                <Typography
                  as="span"
                  variant="body-sm"
                  weight="medium"
                  className="badge h-8 gap-1.5 border-base-300 bg-base-100 px-3"
                >
                  <Clock3 size={15} aria-hidden="true" />
                  {recipe.preparation_time + recipe.cooking_time} min
                </Typography>
                {props.mealTimes
                  .filter((mealTime) =>
                    discovery.selectedMealTimes.includes(mealTime.slug),
                  )
                  .map((mealTime) => (
                    <Typography
                      as="span"
                      variant="body-sm"
                      key={mealTime.id}
                      weight="medium"
                      className="badge h-8 gap-1.5 border-base-300 bg-base-100 px-3"
                    >
                      <UtensilsCrossed size={15} aria-hidden="true" />
                      {mealTime.name}
                    </Typography>
                  ))}
                <Typography
                  as="span"
                  variant="body-sm"
                  weight="medium"
                  className="badge h-8 gap-1.5 border-base-300 bg-base-100 px-3"
                >
                  <Sparkles size={15} aria-hidden="true" /> Suggestion IA
                </Typography>
              </div>
              <Typography
                as="p"
                variant="body-sm"
                tone="muted"
                className="mt-3 line-clamp-3 min-h-[4.5rem] sm:mt-4"
              >
                {recipe.description}
              </Typography>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6">
                <button
                  type="button"
                  onClick={discovery.skip}
                  disabled={discovery.isSaving}
                  className="btn gap-2 rounded-xl btn-outline btn-secondary max-md:btn-sm"
                >
                  <X size={18} /> Passer
                </button>
                <button
                  type="button"
                  onClick={discovery.save}
                  disabled={discovery.isSaving}
                  className="btn gap-2 rounded-xl btn-secondary max-md:btn-sm"
                >
                  {discovery.isSaving ? (
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
                    {discovery.isSaving ? 'Ajout…' : 'Ajouter'}
                  </Typography>
                  <Typography
                    as="span"
                    variant="body-sm"
                    tone="inherit"
                    className="max-sm:hidden"
                  >
                    {discovery.isSaving ? 'Ajout…' : 'Ajouter au carnet'}
                  </Typography>
                </button>
              </div>
            </div>
          </article>
        </div>
        {discovery.error && (
          <ErrorState error={discovery.error} retry={discovery.retry} />
        )}
      </div>
    </section>
  );
}

function DiscoveryHeader() {
  return (
    <header className="pt-3 sm:pt-5 lg:pt-0">
      <Typography
        as="h1"
        variant="body-2xl"
        tone="secondary"
        className="flex items-center gap-2"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-base-200 text-secondary">
          <Sparkles size={19} aria-hidden="true" />
        </span>
        Mode découverte
      </Typography>
      <Typography as="p" variant="body" tone="secondary" className="mt-1">
        Explorez des recettes personnalisées avec l'IA et ajoutez vos coups de
        cœur à votre carnet.
      </Typography>
    </header>
  );
}

function MealTimesCheckboxGroup({
  mealTimes,
  selected,
  onToggle,
}: {
  mealTimes: MealTimeResource[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Moments de repas</legend>
      <div className="flex items-center gap-3">
        <CookingPot
          className="size-5 shrink-0 text-secondary"
          strokeWidth={2}
          aria-hidden="true"
        />
        <Typography as="p" variant="body" weight="semibold" tone="secondary">
          Moments de repas{' '}
          <Typography as="span" variant="body-sm" weight="regular" tone="muted">
            (facultatif)
          </Typography>
        </Typography>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {mealTimes.map((mealTime) => {
          const isSelected = selected.includes(mealTime.slug);

          return (
            <Typography
              as="label"
              variant="label"
              key={mealTime.id}
              className={`btn gap-2 rounded-lg btn-md hover:text-secondary-content max-md:btn-sm ${isSelected ? 'text-secondary-content btn-secondary' : 'text-secondary btn-outline btn-secondary'}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(mealTime.slug)}
                className={`checkbox checkbox-sm ${isSelected ? 'text-secondary-content' : ''}`}
              />
              {mealTime.name}
            </Typography>
          );
        })}
      </div>
    </fieldset>
  );
}

function PreferenceGroup({
  label,
  icon: Icon,
  options,
  selected,
  onSelect,
  showOptional = true,
}: {
  label: string;
  icon?: LucideIcon;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  showOptional?: boolean;
}) {
  return (
    <div className="pt-5 sm:pt-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            className="size-5 shrink-0 text-secondary"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        <Typography as="p" variant="body" weight="semibold" tone="secondary">
          {label}
          {showOptional && (
            <>
              {' '}
              <Typography as="span" variant="body-sm" tone="muted">
                (facultatif)
              </Typography>
            </>
          )}
        </Typography>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`btn rounded-lg btn-md max-md:btn-sm ${selected === option ? 'btn-secondary' : 'btn-outline btn-secondary'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center text-center">
      <LoaderCircle className="animate-spin text-base-content/50" size={30} />
      <Typography as="p" variant="body" weight="semibold" className="mt-4">
        Création de votre sélection…
      </Typography>
      <Typography as="p" variant="body-sm" tone="muted" className="mt-1">
        Les recettes et leurs images sont générées.
      </Typography>
    </div>
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
