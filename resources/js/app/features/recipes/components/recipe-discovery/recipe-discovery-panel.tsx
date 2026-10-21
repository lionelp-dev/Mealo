import { useRecipeDiscovery } from '../../hooks/use-recipe-discovery';
import { RecipeFormCard } from '../recipe-form-card';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import {
  ArrowLeft,
  CookingPot,
  Leaf,
  LoaderCircle,
  Plus,
  Settings2,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  onSaved: (id: string) => void;
  onPendingChange: (count: number) => void;
  onGeneratingChange: (value: boolean) => void;
  onPreparationChange: (value: boolean) => void;
  mealTimes: MealTimeResource[];
  onClose?: () => void;
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
          <DiscoveryHeader onClose={props.onClose} />
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
                <label className="font-semibold" htmlFor="discovery-prompt">
                  Qu’avez-vous envie de manger ?{' '}
                  <span className="font-normal text-base-content/50">
                    (requis)
                  </span>
                </label>
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
        <DiscoveryHeader onClose={props.onClose} />
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
            <span className="badge badge-soft badge-lg badge-secondary">
              {discovery.diet}
            </span>
          )}
          {props.mealTimes
            .filter((mealTime) =>
              discovery.selectedMealTimes.includes(mealTime.slug),
            )
            .map((mealTime) => (
              <span
                key={mealTime.id}
                className="badge badge-soft badge-lg badge-secondary"
              >
                {mealTime.name}
              </span>
            ))}
        </div>
        <article className="mt-4 rounded-xl border border-base-300 bg-base-100 shadow-sm sm:mt-5 sm:rounded-2xl">
          {recipe.image_data_url ? (
            <img
              src={recipe.image_data_url}
              alt={recipe.name}
              className="h-52 w-full rounded-t-xl object-cover sm:h-64 sm:rounded-t-2xl lg:h-80"
            />
          ) : (
            <div className="flex h-52 items-center justify-center rounded-t-xl bg-base-200 text-sm text-base-content/50 sm:h-64 sm:rounded-t-2xl lg:h-80">
              Image indisponible
            </div>
          )}
          <div className="p-4 sm:p-6">
            <h2
              className="sticky top-9 z-10 -mx-4 truncate bg-base-100 px-4 py-3 text-2xl leading-tight font-bold sm:-mx-6 sm:px-6 sm:text-3xl lg:static lg:mx-0 lg:px-0 lg:py-0"
              title={recipe.name}
            >
              {recipe.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm sm:mt-4">
              <span className="badge badge-soft badge-lg badge-secondary">
                {recipe.preparation_time + recipe.cooking_time} min
              </span>
              {discovery.diet && (
                <span className="badge badge-soft badge-lg badge-success">
                  {discovery.diet}
                </span>
              )}
              <span className="badge badge-lg">Suggestion IA</span>
            </div>
            <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-base-content/70 sm:mt-4 sm:text-base">
              {recipe.description}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3">
              <button
                type="button"
                onClick={discovery.skip}
                disabled={discovery.isSaving}
                className="btn rounded-xl btn-soft btn-md btn-secondary max-md:btn-sm"
              >
                Une autre idée
              </button>
              <button
                type="button"
                onClick={discovery.save}
                disabled={discovery.isSaving}
                className="btn gap-2 rounded-xl btn-md btn-secondary max-md:btn-sm"
              >
                {discovery.isSaving ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                <span className="sm:hidden">
                  {discovery.isSaving ? 'Ajout…' : 'Ajouter'}
                </span>
                <span className="max-sm:hidden">
                  {discovery.isSaving ? 'Ajout…' : 'Ajouter au carnet'}
                </span>
              </button>
            </div>
          </div>
        </article>
        {discovery.notice && (
          <p className="mt-4 text-sm text-success">{discovery.notice}</p>
        )}
        {discovery.error && (
          <ErrorState error={discovery.error} retry={discovery.retry} />
        )}
      </div>
    </section>
  );
}

function DiscoveryHeader({ onClose }: { onClose?: () => void }) {
  return (
    <header className="pt-3 sm:pt-5 lg:pt-0">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-base font-medium text-secondary"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          Quitter le mode découverte
        </button>
      )}
      <h1
        className={`${onClose ? 'mt-5' : ''} text-2xl font-bold tracking-tight sm:text-3xl`}
      >
        Explorez de nouvelles recettes avec l’IA
      </h1>
      <p className="mt-1 text-sm text-secondary/75 sm:text-base">
        Des suggestions adaptées à vos envies et à vos critères.
      </p>
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
        <p className="font-semibold text-secondary/75">
          Moments de repas{' '}
          <span className="font-normal text-base-content/50">(facultatif)</span>
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {mealTimes.map((mealTime) => {
          const isSelected = selected.includes(mealTime.slug);

          return (
            <label
              key={mealTime.id}
              className={`btn gap-2 rounded-lg btn-md max-md:btn-sm ${isSelected ? 'btn-secondary' : 'btn-outline btn-secondary'}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(mealTime.slug)}
                className="checkbox checkbox-sm"
              />
              {mealTime.name}
            </label>
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
        <p className="font-semibold text-secondary/75">
          {label}
          {showOptional && (
            <>
              {' '}
              <span className="font-normal text-base-content/50">
                (facultatif)
              </span>
            </>
          )}
        </p>
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
      <p className="mt-4 font-semibold">Création de votre sélection…</p>
      <p className="mt-1 text-sm text-base-content/60">
        Les recettes et leurs images sont générées.
      </p>
    </div>
  );
}

function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div role="alert" className="mt-5 text-sm text-error">
      <p>{error}</p>
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
