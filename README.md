# Mealo Planner

Les recettes finissent facilement dispersées entre des carnets, des favoris et des conversations. Préparer les menus de la semaine demande alors de retrouver ces idées, de les répartir entre plusieurs jours et de reconstruire à la main une liste de courses cohérente. Dès que cette organisation est partagée avec d’autres personnes, elle devient encore plus difficile à maintenir.

Mealo Planner réunit ce parcours dans une seule application. Une recette peut être créée puis placée dans un planning personnel ou partagé ; les ingrédients nécessaires alimentent ensuite automatiquement la liste de courses de la semaine. L’intelligence artificielle complète ce flux en proposant des recettes, des visuels ou un planning généré à partir des recettes existantes, d’une période et d’un nombre de portions, sans créer un parcours séparé du reste de l’application.

L’objectif n’est donc pas seulement de stocker des recettes, mais de relier la recherche d’une idée, la planification d’un repas et la préparation des courses dans un espace qui reste cohérent pour toutes les personnes concernées.

![Interface de Mealo Planner](./docs/images/app.png)

## Documentation

1. [Démarrage](docs/getting-started.md)
2. [Domaine métier](docs/domain.md)
3. [Modèle de données](docs/architecture/erd.mmd)
4. [Architecture backend](docs/architecture/backend.md)
5. [Architecture frontend](docs/architecture/frontend.md)
6. [Tests](docs/testing.md)
7. [Dette connue](docs/known-debt.md)

## Stack technique

| Couche | Technologies |
| --- | --- |
| Backend | Laravel 12, PHP 8.2+, Inertia.js |
| Frontend | React 19, TypeScript, Tailwind CSS 4, DaisyUI, Radix UI |
| Données | SQLite en développement, Eloquent, Spatie Laravel Data |
| Tests | Pest PHP, PHPUnit, PHPStan |
| État / formulaires | Zustand, TanStack React Form, Zod |
| Build | Vite 7, pnpm |
| Queue | Laravel Queue pour les générations de recettes longues |
| IA | OpenRouter via client OpenAI-compatible et appel HTTP direct pour les images |
