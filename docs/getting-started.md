# Démarrage

## Prérequis

- PHP 8.2+
- Composer
- Node.js 22
- pnpm 10
- SQLite

## Installation

### Installer les dépendances

```bash
composer install
pnpm install
```

### Créer l’environnement et la base locale

```bash
cp .env.example .env
touch database/database.sqlite
```

La configuration fournie utilise SQLite. Pour une autre base de données, adapter la connexion dans `.env` avant de lancer les migrations. Si l’application tourne hors du contexte local standard, adapter également les URL Laravel, Vite et Inertia.

Pour générer les recettes pendant le seed et utiliser les fonctionnalités IA, renseigner une vraie clé OpenRouter :

```dotenv
OPEN_ROUTER_API_KEY=...
```

Sans clé, ou avec la clé factice de `.env.example`, les jobs de recettes IA restent en queue et sont relancés plus tard. Les fonctionnalités IA ne peuvent pas générer de contenu tant qu’une vraie clé OpenRouter n’est pas configurée.

### Initialiser l’application

```bash
php artisan key:generate
php artisan migrate --seed
```

La migration initialise la base et le seed ajoute les données de référence. Les recettes IA demandées par le seed sont générées en arrière-plan par la queue.

### Démarrer l’environnement de développement

```bash
composer dev
```

`composer dev` lance en parallèle :

- `php artisan serve` ;
- `php artisan queue:listen --tries=1` ;
- `php artisan pail --timeout=0` ;
- `npm run dev`.

Le projet utilise pnpm pour installer et verrouiller les dépendances. Le script Composer appelle actuellement `npm run dev` uniquement pour démarrer Vite depuis les dépendances déjà installées.

Le listener lancé par `composer dev` traite la queue par défaut. Les recettes IA du seeder sont envoyées sur la queue nommée `recipes` ; pour les générer, lancer dans un autre terminal :

```bash
php artisan recipe:start-workers
```

Pour lancer les processus séparément, utiliser les commandes ci-dessus directement.

## Commandes utiles

### Vérifications sans réécriture

```bash
composer run test
composer run test:types
composer run test:coverage
vendor/bin/pint --test
pnpm types
pnpm format:check
```

### Corrections automatiques

Ces commandes peuvent modifier les fichiers :

```bash
composer run lint
pnpm lint
pnpm format
```

### Génération de code

```bash
php artisan wayfinder:generate --with-form
php artisan typescript:transform
```

Après modification des routes, régénérer les helpers Wayfinder. Après modification d’une classe `#[TypeScript]`, régénérer les types TypeScript.

---

[Documentation](../README.md) | [Suivant : Domaine métier](domain.md) →
