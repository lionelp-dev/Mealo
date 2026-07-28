# Mealo Planner

Mealo Planner est une application web full-stack développée avec Laravel, Inertia.js, React et TypeScript. Elle permet de gérer des recettes, de planifier des repas dans des espaces personnels ou partagés et de générer automatiquement une liste de courses à partir du planning.

L’application intègre également des fonctionnalités d’intelligence artificielle permettant de générer des recettes, de créer des visuels et de proposer des plannings de repas à partir des recettes enregistrées.

![Interface de Mealo Planner](./docs/images/app.png)

## Installation

### Prérequis

- PHP 8.2+ ;
- Composer ;
- Node.js 22 ;
- pnpm 10 ;
- SQLite.

##

Installer les dépendances backend :

```bash
composer install
```

Installer les dépendances frontend :

```bash
pnpm install
```

Créer le fichier d'environnement local :

```bash
cp .env.example .env
```

Générer la clé applicative Laravel :

```bash
php artisan key:generate
```

Créer la base de donnée SQLite :

```bash
touch database/database.sqlite
```


##

Renseigner les mots de passe utilisés par les utilisateurs créés par le seed :

```dotenv
USERS_DEV_PASSWORD=...

USERS_TEST_PASSWORD=...
```

Optionnel pour l'installation, mais requis pour générer du contenu IA : renseigner une vraie clé OpenRouter.

```dotenv
OPEN_ROUTER_API_KEY=...
```

##

Appliquer les migrations puis charger les données initiales :

```bash
php artisan migrate --seed
```

## Démarrage

Lancer l'application en développement :

```bash
composer dev
```

## Documentation

1. [Domaine métier](docs/domain.md)
2. [Modèle de données](docs/architecture/data-model.md)
3. [Architecture backend](docs/architecture/backend.md)
4. [Architecture frontend](docs/architecture/frontend.md)
5. [Tests](docs/testing.md)
6. [Dette connue](docs/known-debt.md)
