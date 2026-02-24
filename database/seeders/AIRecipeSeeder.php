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

        echo "🚀 Dispatching {$totalRecipes} recipe generation jobs to queue\n";

        for ($i = 0; $i < $totalRecipes; $i++) {
            $mealTimes = ['petit-déjeuner', 'déjeuner', 'dîner', 'collation'];
            $styles = ['traditionnel', 'moderne', 'épicé', 'léger', 'crémeux', 'dessert'];

            $prompt = 'Plat '.fake()->randomElement($styles).' pour '.fake()->randomElement($mealTimes);

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
