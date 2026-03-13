<?php

namespace App\Console\Commands;

use App\Models\BetaRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class BetaCleanupAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'beta:cleanup-all {--force : Skip confirmation prompt}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete ALL beta users (even non-expired ones) - DANGER';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $convertedRequests = BetaRequest::query()
            ->where('status', 'converted')
            ->with('user')
            ->get();

        if ($convertedRequests->isEmpty()) {
            $this->info('✅ No beta users found.');

            return self::SUCCESS;
        }

        $this->warn('⚠️  DANGER: This will delete ALL beta users, even those whose accounts have not expired!');
        $this->warn("📋 Found {$convertedRequests->count()} beta user(s) to delete.");

        if (! $this->option('force')) {
            if (! $this->confirm('Are you sure you want to proceed?', false)) {
                $this->info('❌ Operation cancelled.');

                return self::FAILURE;
            }
        }

        $this->newLine();
        $this->info('🗑️  Deleting all beta users...');

        $count = 0;

        foreach ($convertedRequests as $convertedRequest) {
            if ($convertedRequest->user) {
                $email = $convertedRequest->email;
                $convertedRequest->user->delete(); // CASCADE delete
                $count++;

                Log::info('Beta user manually deleted via cleanup-all', [
                    'email' => $email,
                    'expires_at' => $convertedRequest->account_expires_at,
                ]);

                $this->line("  🗑️  Deleted: {$email}");
            }

            $convertedRequest->markAsExpired();
        }

        $this->newLine();
        $this->info("✅ Successfully deleted {$count} beta user(s).");

        return self::SUCCESS;
    }
}
