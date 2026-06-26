# Architecture backend <!-- omit from toc -->

Le backend doit garder les règles métier lisibles sans les laisser disparaître dans les Controllers, les modèles ou les Jobs. Cette page présente d’abord le cycle d’une requête, puis les couches qui portent la validation, l’autorisation, les opérations métier et les effets automatiques.

## Sommaire <!-- omit from toc -->

- [Cycle d’une requête backend](#cycle-dune-requête-backend)
- [Validation et sérialisation des données](#validation-et-sérialisation-des-données)
  - [DTOs de requête et de ressource](#dtos-de-requête-et-de-ressource)
  - [Génération des types TypeScript](#génération-des-types-typescript)
- [Controllers](#controllers)
- [Autorisation et Policies](#autorisation-et-policies)
- [Actions](#actions)
- [Observers](#observers)
- [Messages et erreurs métier](#messages-et-erreurs-métier)
  - [Messages utilisateur](#messages-utilisateur)
  - [Exceptions métier](#exceptions-métier)

## Cycle d’une requête backend

Une requête Inertia suit un cycle HTTP classique. Elle arrive par une route, traverse les couches applicatives, puis revient vers le navigateur avec une réponse ou une redirection.

```text
Écriture
  -> valider la requête
  -> vérifier l’accès
  -> déléguer la logique métier à une Action
  -> persister les données
  -> laisser les Observers synchroniser les données liées
  -> retourner une réponse Inertia ou une redirection
```

```text
Lecture
  -> vérifier l’accès
  -> charger les données nécessaires
  -> transformer les données avec un DTO de ressource
  -> transmettre les props à Inertia
  -> rendre la page React
```

## Validation et sérialisation des données

### DTOs de requête et de ressource

Les DTOs définissent les contrats de données du backend. Ils valident les entrées, transforment les sorties et servent de source pour les types consommés par le frontend. Le projet s’appuie pour cela sur Spatie Laravel Data.

- les DTOs de requête dans `app/Data/Requests/` valident et typent les données entrantes ;
- les DTOs de ressource dans `app/Data/Resources/` transforment les données des modèles Eloquent avant leur envoi à Inertia.

```php
// app/Data/Requests/Recipe/RecipeStoreRequestData.php

#[TypeScript]
class RecipeStoreRequestData extends Data
{
    public function __construct(
        public string $name,
        public string $description,
        public int $serving_size,
        public int $preparation_time,
        public int $cooking_time,
        /** @var MealTimeRequestData[] */
        public array $meal_times,
        /** @var IngredientRequestData[] */
        public array $ingredients,
        /** @var StepRequestData[] */
        public array $steps,
        /** @var TagRequestData[] */
        public array $tags,
        #[LiteralTypeScriptType('File|null')]
        public ?UploadedFile $image = null,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => 'required|string|min:0|max:255',
            'description' => 'required|string|min:0|max:1000',
            'serving_size' => 'required|integer|min:1|max:50',
            'meal_times' => 'required|array|min:1|max:4',
            'ingredients' => 'required|array|min:1|max:255',
            'steps' => 'required|array|min:1|max:255',
            'tags' => 'required|array|min:1|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
        ];
    }
}
```

```php
// app/Data/Resources/Recipe/Entities/RecipeResourceData.php

#[TypeScript]
class RecipeResourceData extends Data
{
    public function __construct(
        public string $id,
        public int $user_id,
        public string $name,
        public string $description,
        // Autres champs scalaires et relations omis dans cet extrait.
        /** @var Lazy|Collection<int, RecipeIngredientResourceData> */
        #[LiteralTypeScriptType(
            'Array<RecipeIngredientResourceData>|undefined'
        )]
        public Lazy|Collection $ingredients,
        public ?string $image_url,
        public ?CarbonImmutable $created_at,
        public ?CarbonImmutable $updated_at,
    ) {}

    public static function fromModel(Recipe $recipe): self
    {
        return new self(
            id: $recipe->id,
            user_id: $recipe->user_id,
            name: $recipe->name,
            description: $recipe->description,
            // Autres champs omis dans cet extrait.
            ingredients: Lazy::create(
                fn () => RecipeIngredientResourceData::collect(
                    $recipe->ingredients
                )
            ),
            image_url: $recipe->getImageUrl(),
            created_at: $recipe->created_at?->toImmutable(),
            updated_at: $recipe->updated_at?->toImmutable(),
        );
    }
}
```

À retenir : un DTO décrit un contrat et transforme des données ; il ne porte ni logique métier, ni accès autonome à la base, ni appel externe.

### Génération des types TypeScript

Lorsqu’un DTO porte l’attribut `#[TypeScript]`, sa structure peut être convertie en type TypeScript. Il n’est donc pas nécessaire de recopier manuellement les mêmes champs dans le frontend. Cette commande régénère toutes les structures PHP annotées :

```bash
php artisan typescript:transform
```

Les types générés sont regroupés dans `resources/js/types/generated.d.ts`. Ce fichier est généré automatiquement et ne doit pas être modifié à la main. Les DTOs PHP restent la source de référence, tandis que le frontend consomme les types générés et complète les formulaires avec sa [validation côté interface](frontend.md#validation-des-formulaires).

## Controllers

Une route HTTP doit encore convertir une intention utilisateur en appel applicatif et restituer un résultat adapté au navigateur. Les Controllers assurent cette orchestration sans réimplémenter le métier : ils reçoivent des DTOs déjà validés, vérifient les autorisations, délèguent le travail à une Action et construisent la réponse.

Le flux d’écriture reste ainsi lisible :

```php
// app/Http/Controllers/RecipeController.php

public function store(
    RecipeStoreRequestData $recipeStoreRequestData,
    RecipeStoreAction $recipeStoreAction,
): RedirectResponse {
    Gate::authorize('create', Recipe::class);

    $recipe = $recipeStoreAction->execute(
        $this->authenticatedUser(),
        $recipeStoreRequestData,
    );

    return to_route('recipes.show', ['recipe' => $recipe->id])
        ->with('success', 'Recipe successfully created');
}
```

Pour une lecture, le Controller charge uniquement les relations nécessaires puis passe par un DTO de ressource :

```php
public function show(Recipe $recipe): Response
{
    Gate::authorize('view', $recipe);

    $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

    return Inertia::render('recipe/show', [
        'recipe' => RecipeResourceData::from($recipe)
            ->include('ingredients'),
    ]);
}
```

À retenir : un Controller orchestre le HTTP ; il ne doit pas absorber les règles métier qui appartiennent aux Actions.

## Autorisation et Policies

Dans une application collaborative, être authentifié ne suffit pas : une personne peut posséder une recette, consulter un workspace et ne disposer que d’un rôle limité dans un autre. Les opérations sensibles passent donc par `Gate::authorize`, qui délègue la décision à une Policy Laravel.

Les Policies répondent à une question d’accès et ne modifient ni les modèles ni l’état métier. `RecipePolicy` vérifie l’accès aux recettes, tandis que `WorkspacePolicy` applique les règles liées aux rôles du workspace actif. Lorsqu’un refus doit être lisible, les Policies s’appuient sur des messages ou exceptions métier pour retourner une raison explicite.

À retenir : la Policy décide si l’opération est autorisée ; l’Action peut ensuite supposer que cette frontière a déjà été franchie.

## Actions

Dans une application Laravel, la logique métier finit facilement dans les Controllers. À mesure que les règles s’y accumulent, elle devient difficile à lire, à tester hors HTTP et à réutiliser depuis une commande ou un Job. Les Actions répondent à ce problème en isolant une opération précise : créer une recette, synchroniser ses relations, modifier un workspace, générer un planning ou supprimer une image.

Elles permettent de :

- tester les règles métier hors du cycle HTTP ;
- appeler la même opération depuis un Controller, une commande ou un Job ;
- regrouper les modifications atomiques dans une transaction ;
- rendre explicites les dépendances nécessaires à l’opération.

La création d’une recette délègue chaque synchronisation à une Action spécialisée tout en garantissant l’atomicité de l’ensemble :

```php
// app/Actions/Recipes/RecipeStoreAction.php

class RecipeStoreAction
{
    public function __construct(
        private RecipeSyncIngredientsAction $syncIngredients,
        private RecipeSyncTagsAction $syncTags,
        private RecipeSyncMealTimesAction $syncMealTimes,
        private RecipeSyncStepsAction $syncSteps,
        private RecipeUploadImageAction $uploadImage,
    ) {}

    public function execute(
        User $user,
        RecipeStoreRequestData $recipeData,
    ): Recipe {
        return DB::transaction(function () use ($user, $recipeData): Recipe {
            $recipe = Recipe::query()->create([
                'user_id' => $user->id,
                ...$recipeData->except('image')->transform(),
            ]);

            ($this->syncIngredients)($recipe, $recipeData->ingredients);
            ($this->syncTags)($recipe, $recipeData->tags);
            ($this->syncMealTimes)($recipe, $recipeData->meal_times);
            ($this->syncSteps)($recipe, $recipeData->steps);

            if ($recipeData->image) {
                ($this->uploadImage)($recipe, $recipeData->image);
                $recipe->refresh();
            }

            return $recipe;
        });
    }
}
```

La transaction SQL empêche les écritures partielles dans les tables et relations : une recette ne peut pas être conservée avec seulement une partie de ses ingrédients ou de ses étapes. Les effets externes, comme un fichier déjà écrit sur le stockage, ne sont toutefois pas annulés automatiquement.

À retenir : une Action porte une opération métier testable, indépendante du rendu Inertia, de la session et de la forme HTTP de la réponse.

## Observers

Certaines conséquences doivent se produire quelle que soit l’origine d’un changement. Dans le parcours recettes, planning et liste de courses, le risque métier n’est pas seulement de mal créer une recette : c’est de laisser le planning ou les ingrédients à acheter dans un état incohérent. Les Observers réagissent donc aux événements Eloquent lorsqu’un changement doit maintenir la cohérence entre plusieurs entités, indépendamment du point d’entrée qui l’a déclenché.

Le parcours explicite reste porté par les Controllers et les Actions :

1. une recette est créée par `RecipeController` et les Actions de `app/Actions/Recipes/` ;
2. elle est placée dans un planning par `PlannedMealController` et les Actions de `app/Actions/PlannedMeal/`.

La cohérence automatique commence ensuite sur les événements Eloquent :

1. `PlannedMealObserver` synchronise la liste de courses de la semaine lorsqu’un repas planifié est créé, modifié ou supprimé ;
2. lorsqu’une recette est supprimée, `RecipeObserver` supprime l’image et les repas planifiés associés ;
3. chaque suppression de repas déclenche à son tour `PlannedMealObserver`, qui recalcule la liste de courses.

```php
// app/Observers/RecipeObserver.php

class RecipeObserver
{
    public function __construct(
        private RecipeImageDeleteAction $recipeImageDeleteAction,
    ) {}

    public function deleting(Recipe $recipe): void
    {
        ($this->recipeImageDeleteAction)($recipe);

        $recipe->plannedMeals()->each(function ($plannedMeal) {
            $plannedMeal->delete();
        });
    }
}
```

La suppression individuelle des repas est intentionnelle : elle émet un événement Eloquent pour chacun d’eux. Une suppression en masse serait plus courte, mais elle empêcherait `PlannedMealObserver` de recalculer les listes concernées.

```php
// app/Observers/PlannedMealObserver.php

class PlannedMealObserver
{
    public function __construct(
        private ShoppingListService $shoppingListService,
    ) {}

    public function created(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }

    public function updated(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }

    public function deleted(PlannedMeal $plannedMeal): void
    {
        $this->shoppingListService->sync($plannedMeal);
    }
}
```

`ShoppingListService` correspond à l’implémentation transitoire actuellement injectée dans cet Observer. Il est cité pour décrire fidèlement le code existant, mais ne constitue pas une couche architecturale cible.

Les Observers sont réservés aux effets de cohérence attachés au cycle de vie d’un modèle. Les opérations directement déclenchées par l’utilisateur restent dans des Actions explicites. Cette distinction conserve les automatismes indispensables sans rendre tous les effets de l’application invisibles à la lecture du flux principal.

À retenir : un Observer maintient une cohérence automatique liée à Eloquent ; il ne remplace pas une Action utilisateur explicite.

## Messages et erreurs métier

Un traitement backend se termine généralement de deux façons : soit il réussit et renvoie un message utilisateur, soit il s’interrompt parce qu’une règle métier refuse l’opération. Regrouper ces sorties évite de les traiter comme des couches supplémentaires.

### Messages utilisateur

Dans le parcours nominal, après une création, une modification ou une suppression, l’utilisateur doit recevoir un retour clair et cohérent. Des chaînes dispersées dans les Controllers compliquent les traductions et rendent les assertions de tests fragiles.

La convention cible est de centraliser ces messages dans `app/Messages/`. Cette migration est progressive : certains Controllers contiennent encore des chaînes écrites en dur, et cet écart est suivi dans la [dette connue](../known-debt.md).

Les domaines déjà migrés suivent cette structure :

```text
app/Messages/
  Message.php
  Workspace/
    WorkspaceCreatedMessage.php
    WorkspaceUpdatedMessage.php
    WorkspaceDeletedMessage.php
  WorkspaceInvitation/
    InvitationSentMessage.php
    InvitationAcceptedMessage.php
```

Chaque classe s’appuie sur les traductions Laravel :

```php
// app/Messages/Workspace/WorkspaceCreatedMessage.php

class WorkspaceCreatedMessage extends Message
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? __('messages.workspace.created')
        );
    }
}
```

Le Controller utilise alors le même objet que les tests :

```php
return back()->with([
    'success' => (new WorkspaceCreatedMessage)->getMessage(),
    'new_workspace_id' => $workspace->id,
]);
```

À retenir : un message utilisateur centralisé donne une formulation stable au Controller, à l’interface et aux tests.

### Exceptions métier

Lorsqu’une autorisation ou une règle métier interrompt le parcours nominal, les exceptions génériques décrivent mal la raison du refus. Une hiérarchie par domaine rend l’erreur explicite dans le code et fournit un message contextualisé à l’utilisateur.

Exemples actuels :

- `CannotDeleteWorkspaceException` ;
- `CannotInviteToWorkspaceException` ;
- `ExpiredWorkspaceInvitationException` ;
- `NotForYouWorkspaceInvitationException`.

Une exception métier conserve le comportement de l’exception Laravel adaptée tout en utilisant une clé de traduction :

```php
// app/Exceptions/Workspace/CannotDeleteWorkspaceException.php

class CannotDeleteWorkspaceException extends AuthorizationException
{
    public function __construct(?string $message = null)
    {
        parent::__construct(
            $message ?? t(
                'authorization.workspace.delete_denied',
                'You are not authorized to delete this workspace.',
            )
        );
    }
}
```

Ces exceptions ne remplacent pas la validation et ne doivent pas masquer une erreur technique. Elles servent à nommer une règle métier, la rendre testable et restituer une erreur lisible.

À retenir : une exception métier interrompt le parcours avec une raison explicite, sans déguiser une erreur technique.

---

← [Précédent : Modèle de données](erd.mmd) | [Documentation](../../README.md) | [Suivant : Architecture frontend](frontend.md) →
