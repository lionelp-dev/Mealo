<?php

namespace Database\Seeders;

use App\Jobs\GenerateRecipeJob;
use App\Models\User;
use Illuminate\Database\Seeder;

class AIRecipeSeeder extends Seeder
{
    public function __construct(private User $user) {}

    public function run(): void
    {

        if (! $this->user) {
            echo "❌ Test user not found. Please run UserSeeder first.\n";

            return;
        }

        $delayBetweenJobs = config('recipe-queue.rate_limit.delay_between_jobs', 6);
        $totalRecipes = 20;

        $prompts = [
            'Plat traditionnel pour petit-déjeuner',
            'Plat moderne pour déjeuner',
            'Plat épicé pour dîner',
            'Plat léger pour collation',
            'Plat crémeux pour petit-déjeuner',
            'Plat dessert pour collation',
            'Plat traditionnel pour dîner',
            'Plat léger pour déjeuner',
            'Plat épicé pour petit-déjeuner',
            'Plat moderne pour collation',
            'Plat crémeux pour dîner',
            'Plat traditionnel pour déjeuner',
            'Plat dessert pour petit-déjeuner',
            'Plat léger pour dîner',
            'Plat moderne pour petit-déjeuner',
            'Plat épicé pour collation',
            'Plat crémeux pour déjeuner',
            'Plat traditionnel pour collation',
            'Plat léger pour petit-déjeuner',
            'Plat dessert pour dîner',
        ];

        echo "🚀 Dispatching {$totalRecipes} recipe generation jobs to queue\n";

        for ($i = 0; $i < $totalRecipes; $i++) {
            $prompt = $prompts[$i];

            $delay = $i * $delayBetweenJobs;

            GenerateRecipeJob::dispatch($this->user->id, $prompt, $i + 1)
                ->delay(now()->addSeconds($delay));

            echo '📤 Queued recipe #'.($i + 1)." (delay: {$delay}s): {$prompt}\n";
        }

        echo "\n✅ All {$totalRecipes} recipe jobs queued successfully!\n";
        echo "🔧 Start the queue worker: php artisan queue:work --queue=recipes\n";
        echo "📊 Monitor progress: php artisan queue:monitor\n";
    }
}
