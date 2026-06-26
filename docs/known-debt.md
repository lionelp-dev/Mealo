# Dette connue

## Backend

- La liste de courses contient encore de la logique directement dans son Controller.
- Certains messages utilisateur sont encore écrits en dur dans les Controllers.

## IA et documentation

- La génération de planning IA ne dispose pas encore de préférences alimentaires structurées : elle s’appuie actuellement sur les recettes existantes, une période et un nombre de portions.
- Les générations IA ne suivent pas toutes le même mode d’exécution : certaines recettes longues passent par une queue dédiée, tandis que d’autres appels restent synchrones.
- L’intégration OpenRouter utilise à la fois le client OpenAI-compatible et un appel HTTP direct pour la génération d’images.
- Les promesses du README et du domaine doivent rester alignées avec ces limites tant que le code ne fournit pas de personnalisation plus complète.

## Frontend

### Parité Zod et Laravel

Les schémas Zod et les règles Laravel ne portent pas encore les mêmes contraintes. Les corrections attendues sont :

- aligner les maximums de la description, des temps et des tableaux de recettes ;
- décider si WebP doit être accepté ou refusé des deux côtés ;
- ajouter une matrice commune de cas limites exécutée côté Pest et côté frontend lorsque la stratégie de tests frontend sera active.

`satisfies z.ZodType<T>` vérifie une compatibilité structurelle à la compilation. Il ne compare pas les règles de validation Laravel et Zod.

### Typage Inertia de Recipes

Le `PageProps` commun de `RecipesInertiaAdapter` exige actuellement des props qui ne sont pas présentes sur toutes les pages Recipes. Il faut :

- définir des contrats propres à chaque page ou une union discriminée ;
- corriger les props déclarées obligatoires alors qu’elles peuvent être absentes ;
- corriger la nullabilité de `show_recipe_ai_generation_modal` ;
- ne pas confondre le générique `usePage<PageProps>()` avec une validation d’exécution.

### Soumission des formulaires

`useCreateRecipe` expose `processing` et `errors`, mais `CreateRecipesView` ne les consomme pas. La soumission TanStack n’est pas non plus liée à la durée réelle de la visite Inertia. Il faut connecter ces états au formulaire ou à la View et synchroniser `isSubmitting` avec le transport.

### Transport Inertia

Certains appels Inertia sont encore déclenchés depuis des hooks, Views ou Components. Les nouveaux appels suivent la convention des repositories ; les appels existants doivent y être migrés progressivement.

Les modules bêta/admin et quelques écrans transverses suivent également les conventions cibles de manière partielle.

### Internationalisation

L’infrastructure `react-i18next` est active, mais son adoption reste incomplète. Il faut :

- déplacer les messages Zod écrits directement en français vers les catalogues ;
- auditer les chaînes utilisateur encore dispersées dans l’interface ;
- initialiser explicitement i18n dans l’entrée SSR ou documenter l’absence de prise en charge SSR.

## Tests

- Les tests frontend ne disposent pas encore d’une stratégie active au-delà de quelques stories Storybook. Les futurs tests de contrat Zod/Laravel dépendent de cette mise en place.
- Les tests présents dans `tests/Browser/` ne sont pas encore reliés au `TestCase` Laravel dans `tests/Pest.php` et échouent actuellement avant les assertions navigateur.

---

← [Précédent : Tests](testing.md) | [Documentation](../README.md)
