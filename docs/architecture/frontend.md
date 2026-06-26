# Architecture frontend <!-- omit from toc -->

Le frontend doit rester lisible à mesure que l’application grandit. Cette page explique comment le code est organisé pour séparer l’affichage, l’état, les contrats de données et les échanges avec le serveur.

## Sommaire <!-- omit from toc -->

- [Organisation par feature](#organisation-par-feature)
- [Composition de l’interface](#composition-de-linterface)
  - [Pages et adaptateurs Inertia](#pages-et-adaptateurs-inertia)
  - [Views](#views)
    - [Exemple de lecture](#exemple-de-lecture)
    - [Exemple d’écriture](#exemple-décriture)
  - [Components](#components)
- [Hooks et stores](#hooks-et-stores)
- [Validation des formulaires](#validation-des-formulaires)
  - [Schémas de requête](#schémas-de-requête)
  - [Limites actuelles](#limites-actuelles)
- [Repositories](#repositories)
- [Internationalisation](#internationalisation)

## Organisation par feature

Le frontend est organisé autour des usages de l’application plutôt qu’autour des seuls types de fichiers. Une fonctionnalité regroupe ce qui sert un même besoin, puis sépare ses responsabilités à l’intérieur de ce périmètre.

Cette organisation évite deux extrêmes : chercher une fonctionnalité dans toute l’arborescence, ou tout empiler dans un seul composant. Le dossier de feature devient le point d’entrée, et les sous-dossiers indiquent ensuite où se trouvent l’affichage, l’état ou le transport.

Structure principale du frontend :

```text
resources/js/
  actions/          # Wayfinder généré, ne pas modifier
  routes/           # routes et réexports par domaine
  pages/            # entrées Inertia fines
  types/            # types manuels et générés
  app/
    features/       # modules fonctionnels
    components/     # composants partagés
    hooks/          # hooks partagés
    stores/         # stores Zustand partagés
    layouts/        # layouts applicatifs
    data/           # schémas et types frontend
    locales/        # traductions
```

Arborescence réelle abrégée de la feature Recipes :

```text
app/features/recipes/
  inertia.adapter.tsx
  views/
    index.recipes.view.tsx
    create.recipes.view.tsx
    edit.recipes.view.tsx
    show.recipes.view.tsx
  components/
  repositories/
  stores/
```

Chaque élément possède un rôle précis :

- `inertia.adapter.tsx` transforme les props de page en contexte de feature ;
- `views/` orchestre les pages complètes ;
- `components/` regroupe la présentation et les interactions locales ;
- `repositories/` regroupe les appels de transport déjà extraits ;
- `stores/` conserve l’état UI partagé dans la feature.

Recipes n’a pas de dossier `hooks/` local aujourd’hui. Les hooks qu’elle utilise, comme la coordination des filtres et de la recherche, vivent dans `app/hooks/`.

À retenir : une feature n’a pas besoin de tous les dossiers possibles. Elle ajoute seulement les couches utiles à son besoin.

## Composition de l’interface

La composition de l’interface répond à une question simple : où s’arrête la page, et où commence l’interface métier ? Dans les features principales, la réponse suit un trajet stable : la page Inertia monte l’écran, l’adaptateur expose les props, la View compose le parcours, puis les Components affichent les morceaux réutilisables.

Ce découpage permet de lire une page sans devoir comprendre immédiatement tous les détails de formulaire, d’état ou de transport.

### Pages et adaptateurs Inertia

Dans les domaines organisés par fonctionnalité, la page Inertia reste volontairement fine. Elle ne porte pas la logique de l’écran ; elle branche l’adaptateur de la feature et la View à rendre.

Auth, Settings, Landing et certaines pages Admin conservent encore des composants de page plus développés. L’exemple Recipes montre la forme cible pour les domaines structurés par feature.

```tsx
// resources/js/pages/recipe/index.tsx

export default function Index() {
  return (
    <RecipesInertiaAdapter>
      <IndexRecipesView />
    </RecipesInertiaAdapter>
  );
}
```

L’adaptateur isole ensuite le lien avec Inertia. Au lieu de laisser les composants lire `usePage()` partout, il expose les props dans un contexte de domaine. L’extrait suivant illustre ce passage vers `RecipesProvider`.

```tsx
// resources/js/app/features/recipes/inertia.adapter.tsx

type PageProps = SharedData & {
  recipe: RecipeResource;
  recipes: PaginatedCollection<RecipeResource>;
  tags: TagResource[];
  meal_times: MealTimeResource[];
  show_recipe_ai_generation_modal: boolean;
  generated_recipe?: GeneratedRecipeResource;
};

export const {
  Provider: RecipesProvider,
  useContextValue: useRecipesContextValue,
} = createGenericContext<PageProps & { url: string }>();

export function RecipesInertiaAdapter({
  children,
}: PropsWithChildren) {
  const url = usePage().url;
  const pageProps = usePage<PageProps>().props;
  const data = useMemo(
    () => ({ ...pageProps, url }),
    [pageProps],
  );

  return <RecipesProvider data={data}>{children}</RecipesProvider>;
}
```

L’adaptateur Recipes centralise l’accès aux données, mais ne gère pas les erreurs de rendu : il ne contient pas d’`ErrorBoundary`. Le générique passé à `usePage<PageProps>()` reste aussi un typage statique. Les limites du contrat Recipes sont recensées dans la [dette connue](../known-debt.md#typage-inertia-de-recipes).

À retenir : la page monte l’écran, l’adaptateur traduit les props Inertia en contexte de feature.

### Views

Une View décrit le parcours visible d’un écran. Elle assemble le layout, lit le contexte de la feature et branche les dépendances nécessaires, mais elle ne devrait pas contenir chaque détail d’interaction.

La convention de nommage rend leur rôle visible :

- `index.recipes.view.tsx` ;
- `create.recipes.view.tsx` ;
- `edit.recipes.view.tsx` ;
- `show.recipes.view.tsx` ;
- `planned-meals.index.view.tsx`.

#### Exemple de lecture

En lecture, la View relie les données reçues à leur affichage. L’exemple Recipes lit une collection paginée et confie chaque élément à un Component.

```tsx
export function IndexRecipesView() {
  const { recipes } = useRecipesContextValue();

  return AppLayout({
    children: (
      <InfiniteScroll data="recipes">
        <div>
          {recipes.data.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </InfiniteScroll>
    ),
  });
}
```

La View réelle ajoute les filtres, la recherche et la multisélection, mais ces comportements restent répartis dans les couches adaptées.

#### Exemple d’écriture

En écriture, la View prépare le formulaire et délègue la suite : validation au schéma, envoi au repository. Elle connaît l’intention utilisateur, pas les détails de la requête.

```tsx
export function CreateRecipesView() {
  const { meal_times, generated_recipe } =
    useRecipesContextValue();
  const { createRecipe } = useCreateRecipe();

  const form = useAppForm({
    defaultValues: {
      name: generated_recipe?.name ?? '',
      description: generated_recipe?.description ?? '',
      serving_size: generated_recipe?.serving_size ?? 1,
      ingredients: generated_recipe?.ingredients ?? [],
      steps: generated_recipe?.steps ?? [],
      tags: generated_recipe?.tags ?? [],
      meal_times: generated_recipe?.meal_times ?? [],
      image: generated_recipe?.image ?? null,
    },
    validators: {
      onSubmit: recipeStoreRequestSchema,
    },
    onSubmit: ({ value }) => createRecipe(value),
  });

  // La view compose ensuite les champs et sections du formulaire.
}
```

Les sections Ingredients, Steps et Tags reçoivent le formulaire et restent réutilisables pour la création comme pour l’édition. À retenir : une View orchestre l’écran, elle ne devient pas le lieu unique de toute la logique.

### Components

Les Components portent les morceaux réutilisables ou localisés de l’interface. Ils évitent que la View accumule chaque carte, champ, menu ou interaction.

Leur contrat doit rester étroit : des props pour les données propres au composant, un contexte pour les données de feature, un store pour l’état UI partagé. Une interaction locale, comme l’ouverture d’un menu, reste dans `useState`.

```tsx
export function RecipeCard({ recipe }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
              viewRecipe(recipe.id);
            }
      }
    >
      {isMultiSelectMode && (
        <input
          type="checkbox"
          checked={selectedRecipeIds.includes(recipe.id)}
          onChange={() => {
            toggleRecipeSelection(recipe.id);
          }}
        />
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuItem
          variant="destructive"
          disabled={processing}
          onClick={(e) => {
            e.stopPropagation();
            deleteRecipes({ ids: [recipe.id] });
          }}
        >
          {t('common.buttons.delete', 'Delete')}
        </DropdownMenuItem>
      </DropdownMenu>

      {recipe.meal_times?.map((meal_time) => (
        <span
          key={meal_time.id}
          className={
            isFilterActive({
              type: 'meal_time',
              value: meal_time.id.toString(),
            }) && 'bg-secondary/80 text-secondary-content'
          }
        >
          {t(
            `mealPlanning.dialog.filters.${meal_time.name}`,
            meal_time.name,
          )}
        </span>
      ))}

      <span className="card-title">{recipe.name}</span>
    </div>
  );
}
```

Cet extrait réel est abrégé. Il illustre surtout la frontière du composant : la recette arrive par props, l’ouverture du menu reste locale, la multisélection vient d’un store partagé et les actions sont déléguées.

À retenir : un Component garde l’interaction près de son affichage, sans faire porter tout l’écran à la View.

## Hooks et stores

L’état frontend n’a pas toujours la même portée. Certains états ne concernent qu’un composant ; d’autres doivent être partagés par plusieurs éléments de la page. Le rôle de cette couche est de choisir le bon outil sans transformer React en base de données locale.

La règle reste simple :

- `useState` conserve une interaction strictement locale à un Component ;
- un hook regroupe un calcul, un effet ou une coordination réutilisable ;
- un store Zustand partage un état UI entre plusieurs Views ou Components ;
- les props Inertia restent la source des données reçues et persistées côté serveur.

La multisélection Recipes sert d’exemple. La View active le mode de sélection, les cartes lisent l’état commun et la toolbar agit sur la même sélection. Le store évite de faire circuler ces informations dans toute la hiérarchie par props.

```tsx
  const { isMultiSelectMode, selectedRecipeIds, toggleRecipeSelection } =
    useRecipesMultiSelectStore();
```

`IndexRecipesView`, `RecipeCard` et `RecipesMultiSelectToolbar` partagent ainsi la même source d’état UI. Les filtres fonctionnent de manière proche : le store conserve les choix de l’interface et `useRecipesRequestCoordination` construit les paramètres nécessaires à leur synchronisation.

À retenir : les stores portent l’état UI partagé, pas les données métier persistées. Le hook de coordination contient encore un appel `router.visit`, une limite suivie dans la [dette connue](../known-debt.md#transport-inertia).

## Validation des formulaires

La validation frontend concerne les valeurs produites par l’utilisateur avant leur envoi. Elle sert d’abord à améliorer le retour dans l’interface : signaler vite une erreur, éviter une soumission inutile, guider la correction.

Dans les formulaires Recipes, `useAppForm` branche TanStack React Form avec un schéma Zod. Si les valeurs sont acceptées, la View transmet l’objet validé au repository. Laravel reste ensuite l’autorité finale.

À retenir : Zod améliore l’expérience côté interface ; Laravel décide toujours si la requête est valide.

### Schémas de requête

Les schémas de requête décrivent les données envoyées au serveur. L’exemple suivant montre la forme attendue pour créer une recette ; le fichier réel conserve aussi les messages et règles détaillées.

```typescript
// resources/js/app/data/requests/recipe/schemas/
// recipe-store.request.schema.ts

export const recipeStoreRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  serving_size: z.number().min(1).max(50),
  preparation_time: z.number().min(0),
  cooking_time: z.number().min(0),
  ingredients: z.array(recipeIngredientRequestSchema).min(1),
  steps: z.array(stepRequestSchema).min(1),
  tags: z.array(tagRequestSchema).min(1),
  meal_times: z.array(mealTimeRequestSchema).min(1),
  image: z.union([z.instanceof(File), z.null()]),
}) satisfies z.ZodType<RecipeStoreRequestData>;

export type RecipeStoreRequest = z.infer<
  typeof recipeStoreRequestSchema
>;
```

Le schéma sert à deux niveaux : `onSubmit` valide l’objet complet, tandis que `recipeStoreRequestSchema.shape.*` permet de valider certains champs ou sections. Le type `RecipeStoreRequest` est déduit avec `z.infer`, puis utilisé par le repository.

Exemples réels :

- `resources/js/app/data/requests/recipe/schemas/recipe-store.request.schema.ts` ;
- `resources/js/app/data/requests/recipe/schemas/recipe-update.request.schema.ts`.

### Limites actuelles

La limite principale est la duplication des règles. Une contrainte peut changer côté Laravel sans être reportée dans Zod, ou l’inverse. `satisfies` vérifie une compatibilité de type, pas l’égalité des règles.

Une matrice de tests de contrat pourra devenir utile lorsque la stratégie de tests frontend sera active. Les écarts connus sont détaillés dans la [dette connue](../known-debt.md#parité-zod-et-laravel).

## Repositories

Les repositories isolent le transport Inertia derrière des intentions métier : créer, modifier, supprimer, chercher. La View exprime l’action de l’utilisateur ; le repository connaît la route, les options Inertia et les callbacks.

Ce découpage évite de disperser `router.post`, `router.put` ou `router.delete` dans l’interface. Il rend les écrans plus lisibles et localise les changements de route ou de gestion d’erreur.

L’exemple suivant montre ce contrat pour la création d’une recette : la View appelle `createRecipe`, le repository traduit cette intention en requête Inertia.

```typescript
// resources/js/app/features/recipes/repositories/
// use-create-recipe.ts

export function useCreateRecipe() {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const createRecipe = (data: RecipeStoreRequest) => {
    router.post(recipes.store.url(), data, {
      onBefore: () => setProcessing(true),
      onSuccess: () => setErrors({}),
      onError: (errs) => setErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  return { createRecipe, processing, errors };
}
```

Dans cet exemple, le repository est la seule couche qui connaît le transport. Les routes, les callbacks et les états de visite sont regroupés au même endroit, tandis que le formulaire reste centré sur ses valeurs et sa validation.

Exemples réels :

- `resources/js/app/features/recipes/repositories/use-create-recipe.ts` ;
- `resources/js/app/features/recipes/repositories/use-update-recipe.ts` ;
- `resources/js/app/features/recipes/repositories/use-delete-recipes.ts` ;
- `resources/js/app/features/admin/beta-requests/infrastructure/repositories/beta-requests.repository.ts`.

À retenir : les repositories sont la frontière de transport cible. Cette séparation reste en cours d’adoption, et certaines limites sont suivies dans les dettes [Transport Inertia](../known-debt.md#transport-inertia) et [Soumission des formulaires](../known-debt.md#soumission-des-formulaires).

## Internationalisation

L’internationalisation centralise les textes affichés afin d’éviter que chaque composant porte ses propres libellés. Les traductions vivent dans `resources/js/app/locales/en/translation.json` et `resources/js/app/locales/fr/translation.json`, puis sont chargées avec `react-i18next`.

Les composants accèdent aux clés avec `useTranslation()`. L’extrait suivant montre cet usage réel :

```tsx
const { t } = useTranslation();

<Head title={t('recipes.create.pageTitle', 'Create recipe')} />
```

À retenir : les catalogues doivent rester la source principale des textes. Les messages Zod, certaines chaînes affichées et l’entrée SSR ne suivent pas encore complètement cette organisation ; ces écarts sont recensés dans la [dette connue](../known-debt.md#internationalisation).

---

← [Précédent : Architecture backend](backend.md) | [Documentation](../../README.md) | [Suivant : Tests](../testing.md) →
