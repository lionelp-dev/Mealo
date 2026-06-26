# Tests <!-- omit from toc -->

Tester l'application ne consiste pas seulement à appeler une route puis à vérifier son statut. Un scénario dépend souvent d’un utilisateur, de son rôle dans un workspace, de la recette qu’il possède, du planning actif et des données recalculées en cascade. Recréer ce contexte dans chaque test masquerait rapidement le comportement réellement vérifié.

La suite utilise Pest au-dessus de PHPUnit et fournit des contextes partagés pour rendre ces situations collaboratives faciles à reproduire. Elle protège les invariants métier, les autorisations, les retours utilisateur et l’état final en base, tout en laissant chaque test raconter un scénario lisible.

## Sommaire <!-- omit from toc -->

- [Stratégie et niveaux](#stratégie-et-niveaux)
- [Commandes](#commandes)
- [TestCase et seeders](#testcase-et-seeders)
- [Traits de contexte](#traits-de-contexte)
- [Pattern d’assertion](#pattern-dassertion)
  - [Cas nominal](#cas-nominal)
  - [Cas négatif](#cas-négatif)
- [Couverture de tests attendue](#couverture-de-tests-attendue)

## Stratégie et niveaux

Sans structure commune, chaque test recréerait manuellement ses utilisateurs, rôles, workspaces et relations. La préparation prendrait alors plus de place que l’intention du scénario et les différentes suites risqueraient de construire des états incohérents entre eux. Les traits de contexte fournissent ces situations une seule fois, tandis que le seeder de test charge les données de référence avant chaque cas.

Le dépôt distingue actuellement quatre niveaux :

| Niveau | Objectif | État actuel |
| --- | --- | --- |
| Unitaires | Tester une logique isolée sans parcours HTTP ni infrastructure complète. | Configuré dans `tests/Pest.php`, sans suite `tests/Unit/` actuellement. |
| Intégration | Tester les Actions, services et interactions avec la base. | Actif dans `tests/Integration/`. |
| Fonctionnels | Tester les parcours HTTP, autorisations, redirections, messages et état final en base. | Actif dans `tests/Feature/`. |
| Browser | Tester les comportements qui nécessitent un navigateur. | Présent dans `tests/Browser/`, mais pas encore opérationnel. |

Le niveau choisi est le plus bas capable de protéger le comportement. Une règle contenue dans une Action mérite un test d’intégration ; son exposition via un Controller peut nécessiter en plus un test fonctionnel d’autorisation et de feedback. Cette répartition limite les parcours HTTP coûteux sans renoncer à vérifier ce que l’utilisateur observe réellement.

## Commandes

Commandes principales :

```bash
composer run test
```

Pour cibler un fichier ou un scénario pendant le développement :

```bash
php artisan test tests/Feature/PlannedMeal/PlannedMealStoreTest.php
php artisan test --filter "stores a planned meal"
```

Les commandes Composer restent la référence pour les vérifications PHP du projet. Elles offrent un point d’entrée commun en local comme dans l’intégration continue, tandis que les commandes ciblées raccourcissent la boucle de travail sur un scénario précis.

Les limitations actuelles des tests Browser et frontend sont recensées dans la [dette connue](known-debt.md).

## TestCase et seeders

Une base laissée dans un état variable ou initialisée avec les données de démonstration rendrait les tests dépendants de leur ordre et de détails sans rapport avec le scénario. La classe de base centralise donc le reset de la base, le seeding et les contextes partagés. Elle utilise un seeder dédié afin que les tests disposent des rôles, permissions et données de référence, mais pas des données destinées à présenter l’application.

```php
// tests/TestCase.php

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    use HasUserContext;
    use HasWorkspaceContext;
    use HasRecipeContext;
    use HasPlannedMealContext;

    protected bool $seed = true;

    protected string $seeder = TestDatabaseSeeder::class;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpHasUserContext();
        $this->setUpHasWorkspaceContext();
        $this->setUpHasRecipeContext();
        $this->setUpHasPlannedMealContext();
    }
}
```

L’ordre d’initialisation est important : le contexte workspace dépend des utilisateurs, puis les recettes et repas planifiés s’appuient sur ces premiers objets. Ce socle commun garantit que deux suites parlant d’un propriétaire, d’un éditeur ou d’un workspace partagé manipulent la même réalité métier.

## Traits de contexte

Les scénarios collaboratifs demandent plusieurs objets liés avant même la première action du test. Copier ce montage dans chaque fichier allongerait les cas et rendrait les corrections de domaine difficiles à propager. Les traits dans `tests/Concerns/` préparent ces scénarios réutilisables :

- `HasUserContext` crée les utilisateurs génériques, propriétaires, éditeurs, lecteurs et invités ;
- `HasWorkspaceContext` prépare les workspaces personnels et partagés, les invitations et les rôles ;
- `HasRecipeContext` construit les recettes et leurs relations ;
- `HasPlannedMealContext` fournit les données de planning.

Le contexte utilisateur expose les profils nécessaires à plusieurs domaines :

```php
// tests/Concerns/HasUserContext.php

trait HasUserContext
{
    public User $user;
    public User $otherUser;
    public User $editorUser;
    public User $viewerUser;
    public User $inviteeUser;

    public function setUpHasUserContext()
    {
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
        $this->editorUser = User::factory()->create();
        $this->viewerUser = User::factory()->create();
        $this->inviteeUser = User::factory()->create();
    }
}
```

Le contexte workspace réutilise les mêmes Actions et DTOs que l’application. Il reproduit ainsi un scénario réaliste au lieu de construire un état impossible directement en base :

```php
// tests/Concerns/HasWorkspaceContext.php

$this->storeSharedWorkspaceRequestData =
    WorkspaceStoreRequestData::from([
        'owner_id' => $this->user->id,
        'name' => 'any shared workspace',
        'is_personal' => false,
        'is_default' => false,
    ]);

$this->sharedWorkspace = app(WorkspaceStoreAction::class)
    ->execute(
        $this->user,
        $this->storeSharedWorkspaceRequestData,
    );

$this->sharedWorkspace->users()->attach(
    $this->editorUser->id,
    ['joined_at' => now()],
);

$this->sharedWorkspace->giveEditorPermissions(
    $this->editorUser,
);
```

Pour un parcours HTTP limité au workspace actif, le contexte doit également être placé en session :

```php
$response = $this
    ->actingAs($this->user)
    ->withSession([
        'current_workspace_id' => $this->sharedWorkspace->id,
    ])
    ->get(route('recipes.index'));
```

Ces traits ne cherchent pas à cacher toute préparation. Ils extraient le contexte stable et partagé afin que le corps du test mette en évidence l’action et son résultat. Un nouveau trait devient pertinent lorsqu’un même montage complexe apparaît dans plusieurs suites ; un cas très spécifique reste plus lisible dans son fichier de test.

## Pattern d’assertion

Une redirection réussie ne prouve pas que les bonnes données ont été enregistrées ; inversement, une ligne correcte en base ne garantit pas que l’utilisateur a reçu le bon retour. Un test fonctionnel protège au moin trois dimensions complémentaires :

1. l’état final persistant.
2. la réponse HTTP ou la redirection ;
3. le message de feedback visible par l’utilisateur ;

### Cas nominal

Le test de mise à jour d’un workspace vérifie la persistance, la redirection et le message typé :

```php
// tests/Feature/Workspace/UpdateWorkspaceTest.php

test('owner can update workspace name', function () {
    $updateData = ['name' => 'Any new Name'];

    $response = $this->actingAs($this->user)->put(
        route('workspaces.update', $this->sharedWorkspace),
        $updateData,
    );

    assertDatabaseHas('workspaces', [
        ...$updateData,
        'id' => $this->sharedWorkspace->id,
    ]);

    $response->assertStatus(302);
    $response->assertSessionHas(
        'success',
        new WorkspaceUpdatedMessage()->getMessage(),
    );
});
```

La classe `WorkspaceUpdatedMessage` évite de recopier le texte traduit dans le test. Le test reste stable si la formulation change dans le catalogue de traduction, tout en garantissant que le Controller utilise bien le message prévu par le domaine.

### Cas négatif

Un cas d’erreur doit aussi prouver que la donnée protégée n’a pas été modifiée :

```php
test('cannot change is_personal on default workspace', function () {
    $response = $this->actingAs($this->user)->put(
        route('workspaces.update', $this->defaultWorkspace),
        [
            'name' => 'Default Workspace',
            'is_personal' => false,
        ],
    );

    $this->defaultWorkspace->refresh();

    expect($this->defaultWorkspace->is_personal)->toBeTrue();

    $response->assertStatus(302);
    $response->assertSessionHas(
        'error',
        new CannotUpdateWorkspaceException()->getMessage(),
    );
});
```

Cette assertion négative est essentielle : vérifier uniquement le message d’erreur ne garantit pas que l’écriture a réellement été empêchée. Le test protège à la fois l’explication donnée à l’utilisateur et l’invariant qui devait rester intact.

## Couverture de tests attendue

- les parcours HTTP et redirections utilisateur ;
- les cas positifs et négatifs d’autorisation ;
- les messages de session attendus ;
- l’état final en base, y compris l’absence de modification en cas d’échec ;
- les Actions ou services lorsque la logique dépasse une simple orchestration ;
- les effets en cascade des Observers ;

---

← [Précédent : Architecture frontend](architecture/frontend.md) | [Documentation](../README.md) | [Suivant : Dette connue](known-debt.md)
