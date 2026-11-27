import type { RecipeDiscoveryCriteriaForm } from './recipe-discovery-panel';
import { Typography } from '@/app/components/Typography';
import { MealTimeResource } from '@/app/data/resources/recipe/types';
import {
  ChevronDown,
  CircleCheck,
  Flame,
  Leaf,
  Pencil,
  Pizza,
  Salad,
  Soup,
  Sparkles,
  UtensilsCrossed,
  WandSparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  form: RecipeDiscoveryCriteriaForm;
  mealTimes: MealTimeResource[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};
const dietOptions = [
  'Végétarien',
  'Végan',
  'Sans gluten',
  'Sans produits laitiers',
];
const effortOptions = ['Rapide et simple', 'Sans cuisson', 'À mijoter'];
const inspirations = [
  {
    label: 'Gourmand',
    icon: Pizza,
    className: 'bg-[#fbf1e5] text-[#b65b16]',
  },
  {
    label: 'Réconfortant',
    icon: Soup,
    className: 'bg-[#f7ebe6] text-[#a65243]',
  },
  {
    label: 'Frais et léger',
    icon: Leaf,
    className: 'bg-[#e9f4ee] text-[#287848]',
  },
  { label: 'Épicé', icon: Flame, className: 'bg-[#fae8df] text-[#c94d32]' },
  {
    label: 'Équilibré',
    icon: Salad,
    className: 'bg-[#f1f5e4] text-[#5b7d20]',
  },
  {
    label: 'Original',
    icon: Sparkles,
    className: 'bg-[#f0eafa] text-[#7746b6]',
  },
];

export function RecipeDiscoveryCriteriaScreen({
  form,
  mealTimes,
  isLoading,
  error,
  onRetry,
}: Props) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto px-3 py-5 sm:gap-6 sm:p-8">
      <DiscoveryModeHeader />
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex max-w-200 flex-col gap-5 rounded-2xl bg-base-100 p-3 pb-5 sm:gap-6 sm:px-8 sm:py-6 sm:pb-8">
          <Header />
          <form
            className="flex flex-col gap-8"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <DiscoveryPromptField form={form} />
            <DiscoveryInspirationField form={form} />
            <div className="flex flex-col gap-4">
              <Typography
                as="p"
                variant="body-lg"
                weight="semibold"
                tone="secondary"
              >
                Affiner ma découverte
              </Typography>
              <div className="grid gap-2 sm:grid-cols-3">
                <DiscoveryMealTimeField form={form} mealTimes={mealTimes} />
                <DiscoveryEffortField form={form} />
                <DiscoveryDietField form={form} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <Typography
                as="p"
                variant="body-sm"
                tone="muted"
                className="text-center"
              >
                Vous pouvez découvrir des recettes sans renseigner de critères.
              </Typography>
              <DiscoverySubmitButton form={form} />
            </div>
          </form>
          {error && <ErrorState error={error} retry={onRetry} />}
        </div>
      )}
    </section>
  );
}

function DiscoveryPromptField({ form }: { form: RecipeDiscoveryCriteriaForm }) {
  return (
    <form.Field name="prompt">
      {(field) => (
        <PromptField value={field.state.value} onChange={field.handleChange} />
      )}
    </form.Field>
  );
}

function DiscoveryInspirationField({
  form,
}: {
  form: RecipeDiscoveryCriteriaForm;
}) {
  return (
    <form.Field name="styles">
      {(field) => (
        <InspirationGrid
          selected={field.state.value}
          onSelect={(style) =>
            field.handleChange(
              field.state.value.includes(style)
                ? field.state.value.filter((value) => value !== style)
                : [...field.state.value, style],
            )
          }
        />
      )}
    </form.Field>
  );
}

function DiscoveryMealTimeField({
  form,
  mealTimes,
}: {
  form: RecipeDiscoveryCriteriaForm;
  mealTimes: MealTimeResource[];
}) {
  return (
    <form.Field name="mealTimes">
      {(field) => (
        <DiscoverySelect
          ariaLabel="Moment de repas"
          value={field.state.value[0] ?? ''}
          onChange={(value) => field.handleChange(value ? [value] : [])}
          placeholder="Tous les repas"
          options={mealTimes.map(({ slug, name }) => ({
            value: slug,
            label: name,
          }))}
          icon={UtensilsCrossed}
        />
      )}
    </form.Field>
  );
}

function DiscoveryEffortField({ form }: { form: RecipeDiscoveryCriteriaForm }) {
  return (
    <form.Field name="effort">
      {(field) => (
        <DiscoverySelect
          ariaLabel="Effort de cuisine"
          value={field.state.value ?? ''}
          onChange={(value) => field.handleChange(value || null)}
          placeholder="Effort de cuisine"
          options={effortOptions.map((value) => ({ value, label: value }))}
          icon={Soup}
        />
      )}
    </form.Field>
  );
}

function DiscoveryDietField({ form }: { form: RecipeDiscoveryCriteriaForm }) {
  return (
    <form.Field name="diet">
      {(field) => (
        <DiscoverySelect
          ariaLabel="Alimentation"
          value={field.state.value ?? ''}
          onChange={(value) => field.handleChange(value || null)}
          placeholder="Alimentation"
          options={dietOptions.map((value) => ({ value, label: value }))}
          icon={Leaf}
        />
      )}
    </form.Field>
  );
}

function DiscoverySubmitButton({
  form,
}: {
  form: RecipeDiscoveryCriteriaForm;
}) {
  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <button
          type="submit"
          className="btn flex w-full max-w-70 gap-2 rounded-xl btn-md btn-secondary"
        >
          <WandSparkles size={18} />
          {values.prompt.trim() ||
          values.diet ||
          values.styles.length ||
          values.effort ||
          values.mealTimes.length
            ? 'Découvrir des recettes'
            : 'Surprenez-moi'}
          <span aria-hidden="true">→</span>
        </button>
      )}
    </form.Subscribe>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-1 pt-3 text-center sm:pt-5 lg:pt-0">
      <Typography as="h1" variant="body-2xl" tone="secondary">
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
function PromptField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(value.length > 0);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const expand = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => promptRef.current?.focus());
  };

  return (
    <div
      className="flex cursor-text flex-col gap-2 rounded-xl bg-base-200/40 px-3 py-3 sm:px-6 sm:py-5"
      onClick={expand}
    >
      <Typography
        as="label"
        htmlFor="discovery-prompt"
        variant="body"
        weight="semibold"
        tone="secondary"
      >
        Une envie particulière ?
      </Typography>
      <div className="flex items-start gap-2 border-b border-secondary/30 pb-2 text-secondary focus-within:border-secondary">
        <Pencil
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0"
        />
        <textarea
          ref={promptRef}
          id="discovery-prompt"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          placeholder="Décrivez ce que vous aimeriez manger..."
          className={`min-w-0 flex-1 resize-none bg-transparent p-0 text-sm leading-5 text-secondary outline-none placeholder:text-secondary/70 ${isExpanded ? 'min-h-18' : 'h-6 overflow-hidden'}`}
        />
      </div>
    </div>
  );
}
function InspirationGrid({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Typography as="p" variant="body-lg" weight="semibold" tone="secondary">
          Ou besoin d’inspiration ?
        </Typography>
        <Typography as="span" variant="body-xs" tone="muted">
          {selected.length === 0 && 'Choix multiples'}
          {selected.length === 1 && `${selected.length} sélection`}
          {selected.length > 1 && `${selected.length} sélections`}
        </Typography>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {inspirations.map(({ label, icon: Icon, className }) => (
          <button
            key={label}
            type="button"
            aria-pressed={selected.includes(label)}
            onClick={() => onSelect(label)}
            className={`relative flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border p-3 py-6 text-sm font-medium transition hover:brightness-95 ${className} ${selected.includes(label) ? 'border-current' : 'border-transparent'}`}
          >
            <Icon size={28} strokeWidth={2} />
            <span>{label}</span>
            {selected.includes(label) && (
              <CircleCheck
                size={13}
                strokeWidth={2}
                aria-hidden="true"
                className="absolute top-3 right-3"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
function DiscoverySelect({
  ariaLabel,
  value,
  onChange,
  placeholder,
  options,
  icon: Icon,
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  icon: LucideIcon;
}) {
  return (
    <label className="relative flex h-11 items-center rounded-lg border border-base-300 bg-base-100 px-3 text-secondary">
      <Icon size={16} className="shrink-0" />
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-0 flex-1 appearance-none bg-transparent px-2 text-sm outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none shrink-0" />
    </label>
  );
}
function LoadingState() {
  return (
    <div className="flex min-h-0 max-w-200 flex-1 rounded-2xl bg-base-100 p-6 pb-8">
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
        <img
          src="/discovery-illustration.svg"
          alt=""
          aria-hidden="true"
          className="mb-2 h-35 w-55"
        />
        <Typography as="p" variant="body-xl" weight="semibold" tone="secondary">
          Votre sélection prend forme…
        </Typography>
        <Typography as="p" variant="body" tone="secondary">
          Nous préparons de nouvelles recettes à vous faire découvrir.
        </Typography>
        <div
          className="mt-3 h-1 w-56 overflow-hidden rounded-full bg-secondary/15"
          role="progressbar"
          aria-label="Chargement en cours"
          aria-valuetext="Préparation des recettes et de leurs visuels"
        >
          <span className="block h-full w-1/3 animate-[discovery-progress_1.8s_ease-in-out_infinite] rounded-full bg-secondary/60 motion-reduce:translate-x-full motion-reduce:animate-none" />
        </div>
        <Typography
          as="p"
          variant="body-sm"
          tone="secondary"
          className="mt-1 max-w-50"
        >
          Préparation des recettes et de leurs visuels
        </Typography>
      </div>
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
