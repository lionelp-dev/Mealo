<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class StartRecipeWorkers extends Command
{
    protected $signature = 'recipe:start-workers
                            {--workers=5 : Number of workers to start}
                            {--timeout=300 : Worker timeout in seconds}
                            {--max-jobs=50 : Max jobs per worker}';

    protected $description = 'Start multiple recipe queue workers simultaneously';

    private array $processes = [];

    public function handle(): void
    {
        $workerCount = (int) $this->option('workers');
        $timeout = (int) $this->option('timeout');
        $maxJobs = (int) $this->option('max-jobs');

        $this->info("🚀 Starting {$workerCount} recipe workers...");
        $this->newLine();

        for ($i = 1; $i <= $workerCount; $i++) {
            $this->startWorker($i, $timeout, $maxJobs);
        }

        $this->info("✅ All {$workerCount} workers started successfully!");
        $this->newLine();
        $this->info('📊 Monitor progress: php artisan queue:monitor-recipes');
        $this->info('🛑 Stop all workers: Ctrl+C');
        $this->newLine();

        $this->waitForWorkers();
    }

    private function startWorker(int $workerId, int $timeout, int $maxJobs): void
    {
        $process = new Process([
            'php',
            'artisan',
            'queue:work',
            '--queue=recipes',
            '--sleep=3',
            '--tries=3',
            '--timeout='.$timeout,
            '--max-jobs='.$maxJobs,
            '--name=recipe-worker-'.$workerId,
        ]);

        $process->start();
        $this->processes[] = $process;

        $this->info("🔧 Worker #{$workerId} started (PID: {$process->getPid()})");
    }

    private function waitForWorkers(): void
    {
        $this->info('⏳ Workers are running... Press Ctrl+C to stop all workers');

        if (function_exists('pcntl_signal')) {
            pcntl_signal(SIGINT, function () {
                $this->stopAllWorkers();
                exit(0);
            });
        }

        while (true) {
            $runningCount = 0;

            foreach ($this->processes as $process) {
                if ($process->isRunning()) {
                    $runningCount++;
                }
            }

            if ($runningCount === 0) {
                $this->info("\n✅ All workers have finished");
                break;
            }

            if (function_exists('pcntl_signal_dispatch')) {
                pcntl_signal_dispatch();
            }

            sleep(1);
        }
    }

    private function stopAllWorkers(): void
    {
        $this->warn("\n🛑 Stopping all workers...");

        foreach ($this->processes as $process) {
            if ($process->isRunning()) {
                $process->stop(3, SIGTERM);
            }
        }

        $this->info('✅ All workers stopped');
    }
}
