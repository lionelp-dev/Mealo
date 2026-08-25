# Tests Et Qualité

Le projet s'appuie sur plusieurs niveaux de tests et sur un pipeline CI afin de sécuriser les comportements métier, les parcours utilisateur et les vérifications de qualité.

## Stratégie

| Niveau | Objectif |
| --- | --- |
| Tests fonctionnels | Vérifier les routes, formulaires, permissions, redirections, messages et comportements utilisateur. |
| Tests d'intégration | Tester les Actions métier, les services et les interactions avec la base. |
| Tests Jobs/Console | Couvrir les traitements asynchrones, les commandes Artisan et les comportements liés aux queues. |
| Analyse statique | Vérifier le typage PHP avec Larastan/PHPStan et le typage frontend avec TypeScript. |
| CI GitHub Actions | Automatiser l'installation, le build, les tests et les contrôles qualité. |

## Commandes

```bash
composer test
composer test:types
composer test:coverage
pnpm types        # TypeScript root + api/ai-services-adonis
pnpm lint
pnpm format:check
```

Pour cibler un fichier ou un scénario pendant le développement :

```bash
php artisan test tests/Feature/PlannedMeal/PlannedMealStoreTest.php
php artisan test --filter "stores a planned meal"
```

## Organisation Des Tests

Les tests sont répartis par domaine afin de rendre les scénarios lisibles et de rapprocher les assertions du comportement vérifié.

- `tests/Feature` couvre les parcours HTTP, les autorisations, les redirections, les messages et l'état final en base.
- `tests/Integration/Actions` couvre la logique métier portée par les Actions.
- `tests/Feature/Jobs` et `tests/Feature/Console` couvrent les jobs et commandes Artisan.
- `tests/Browser` contient les tests navigateur, avec une maturité différente des suites Feature et Integration.

## Contextes De Test

Les scénarios collaboratifs demandent souvent plusieurs objets liés : utilisateurs, rôles, workspaces, recettes et repas planifiés. Les traits dans `tests/Concerns/` centralisent ces montages pour éviter de dupliquer le même contexte dans chaque test.

- `HasUserContext` prépare les utilisateurs utiles aux scénarios.
- `HasWorkspaceContext` prépare les workspaces, invitations et rôles.
- `HasRecipeContext` construit les recettes et leurs relations.
- `HasPlannedMealContext` fournit les données de planning.

## Domaines Couverts

- authentification ;
- recettes ;
- planning ;
- liste de courses ;
- workspaces ;
- invitations ;
- bêta/admin ;
- IA ;
- jobs ;
- commandes console.

## Notes De Maturité

Les tests Feature et Integration constituent le socle principal. Les tests Browser existent mais ne sont pas au même niveau de maturité. Les tests frontend peuvent être développés davantage si la stratégie de validation côté interface devient prioritaire.

---

[Sommaire](../README.md#sommaire) | [Architecture](../README.md)
