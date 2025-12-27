# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Laravel)
- `composer dev` - Start full development environment (server, queue, logs, vite)
- `composer dev:ssr` - Start with SSR support
- `composer test` - Run PHP tests (clears config then runs tests)
- `php artisan test` - Run Laravel tests directly
- `php artisan serve` - Start Laravel development server
- `php artisan queue:listen --tries=1` - Start queue worker
- `php artisan pail --timeout=0` - View application logs

### Frontend (React + TypeScript)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run build:ssr` - Build with SSR support
- `npm run types` - TypeScript type checking
- `npm run lint` - ESLint with auto-fix
- `npm run format` - Prettier formatting
- `npm run format:check` - Check Prettier formatting

### Code Quality
- `vendor/bin/pint` - Laravel Pint (PHP formatting)
- PHP CS Fixer available with `@auto` rules enabled

### Testing
- Backend: Pest PHP testing framework
- Frontend: Vitest with Playwright browser testing
- `pnpx vitest run --project=browser` - Run browser tests

## Architecture Overview

### Backend (Laravel 12)
- **Authentication**: Laravel Fortify with two-factor authentication
- **Frontend Integration**: Inertia.js for SPA experience
- **Queue System**: Laravel queues for background processing
- **API Integration**: OpenAI client for AI recipe generation

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Routing**: Inertia.js pages in `resources/js/pages/`
- **UI Components**: Radix UI + DaisyUI + Tailwind CSS
- **State Management**: Zustand
- **Forms**: TanStack React Form
- **Internationalization**: i18next with react-i18next

### Core Domain Models
- **Recipe**: Main recipe entity with ingredients, steps, tags, and meal times
- **PlannedMeal**: Meal planning for specific dates and times
- **ShoppingList**: Generated from planned meals with toggleable ingredients
- **User**: Authentication with two-factor support

### Key Features
- Recipe management with AI generation
- Meal planning by date and meal time (breakfast, lunch, dinner)
- Shopping list generation from planned meals
- Multi-language support
- Dark/light theme switching
- Two-factor authentication

### File Structure
- `app/Models/` - Eloquent models
- `app/Http/Controllers/` - Laravel controllers
- `resources/js/pages/` - Inertia.js page components
- `resources/js/components/` - React components
- `resources/js/schemas/` - Zod validation schemas
- `routes/web.php` - Main application routes
- `routes/auth.php` - Authentication routes
- `routes/settings.php` - Settings routes

### Development Notes
- Uses PNPM package manager
- Laravel Wayfinder for enhanced routing
- Concurrent development setup runs all services together
- Full-stack TypeScript with Laravel backend typing