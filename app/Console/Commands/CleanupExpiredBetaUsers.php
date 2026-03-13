<?php

namespace App\Console\Commands;

use App\Models\BetaRequest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupExpiredBetaUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'beta:cleanup-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete beta users whose accounts have expired';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Searching for expired beta users...');

        $expiredRequests = BetaRequest::query()
            ->where('status', 'converted')
            ->where('account_expires_at', '<', now())
            ->with('user')
            ->get();

        if ($expiredRequests->isEmpty()) {
            $this->info('✅ No expired beta users found.');

            return self::SUCCESS;
        }

        $this->info("📋 Found {$expiredRequests->count()} expired beta user(s).");

        $count = 0;

        foreach ($expiredRequests as $request) {
            if ($request->user) {
                $email = $request->email;
                $request->user->delete(); // CASCADE delete (workspaces, recipes, etc.)
                $count++;

                Log::info('Expired beta user deleted', [
                    'email' => $email,
                    'expired_at' => $request->account_expires_at,
                ]);

                $this->line("  🗑️  Deleted: {$email}");
            }

            $request->markAsExpired();
        }

        $this->newLine();
        $this->info("✅ Successfully deleted {$count} expired beta user(s).");

        return self::SUCCESS;
    }
}
