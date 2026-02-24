<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MonitorRecipeQueue extends Command
{
    protected $signature = 'queue:monitor-recipes
                            {--watch : Watch mode - refresh every few seconds}
                            {--interval=1 : Refresh interval in seconds for watch mode}';

    protected $description = 'Monitor recipe generation queue progress';

    public function handle()
    {
        if ($this->option('watch')) {
            $this->watchMode();
        } else {
            $this->singleCheck();
        }
    }

    private function watchMode(): void
    {
        $interval = (int) $this->option('interval');

        $this->info('📊 Recipe Queue Monitor - Watch Mode');
        $this->info("Refreshing every {$interval} seconds... Press Ctrl+C to stop");
        $this->newLine();

        // Gérer Ctrl+C
        pcntl_signal(SIGINT, function () {
            $this->info("\n👋 Monitoring stopped");
            exit(0);
        });

        while (true) {
            // Effacer l'écran (compatibilité cross-platform)
            if (PHP_OS_FAMILY === 'Windows') {
                system('cls');
            } else {
                system('clear');
            }

            $this->displayStats(true);

            pcntl_signal_dispatch();
            sleep($interval);
        }
    }

    private function singleCheck(): void
    {
        $this->displayStats(false);
    }

    private function displayStats(bool $isWatchMode): void
    {
        $now = now()->format('H:i:s');

        if ($isWatchMode) {
            $this->info("📊 Recipe Queue Monitor - {$now}");
            $this->info('=======================================');
        } else {
            $this->info('📊 Recipe Queue Monitor');
            $this->info('========================');
        }

        // Check queue stats
        $pendingJobs = DB::table('jobs')->where('queue', 'recipes')->count();
        $failedJobs = DB::table('failed_jobs')->count();
        $totalRecipes = Recipe::count();
        $processesRunning = $this->getRunningWorkerCount();

        $this->table(['Metric', 'Count'], [
            ['Pending Jobs', $pendingJobs],
            ['Failed Jobs', $failedJobs],
            ['Total Recipes Created', $totalRecipes],
            ['Active Workers', $processesRunning ?: 'Unable to detect'],
        ]);

        // Progress calculation
        if ($pendingJobs > 0) {
            $this->warn("⏳ {$pendingJobs} jobs remaining in queue");
            if ($processesRunning === 0) {
                $this->info('💡 Start workers: php artisan recipe:start-workers');
            } else {
                $this->info("🔧 {$processesRunning} workers currently processing");
            }
        } else {
            $this->info('✅ No pending jobs in recipe queue');
        }

        if ($failedJobs > 0) {
            $this->error("❌ {$failedJobs} failed jobs - run: php artisan queue:retry all");
        }

        // Show recent recipes
        $recentRecipes = Recipe::latest()->take(5)->get(['name', 'created_at']);
        if ($recentRecipes->count() > 0) {
            $this->info("\n🍽️  Recent Recipes:");
            foreach ($recentRecipes as $recipe) {
                $timeAgo = $recipe->created_at->diffForHumans();
                $this->line("  • {$recipe->name} ({$timeAgo})");
            }
        }

        if ($isWatchMode) {
            $this->newLine();
            $this->comment('Press Ctrl+C to stop monitoring');
        }
    }

    private function getRunningWorkerCount(): int
    {
        try {
            $runningJobs = DB::table('jobs')
                ->where('queue', 'recipes')
                ->where('reserved_at', '>', 0)
                ->count();

            // Si des jobs sont réservés, cela signifie qu'il y a des workers actifs
            return $runningJobs > 0 ? $runningJobs : 0;

        } catch (\Exception $e) {
            return 0;
        }
    }
}
