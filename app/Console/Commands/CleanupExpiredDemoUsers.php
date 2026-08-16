<?php

namespace App\Console\Commands;

use App\Models\DemoAccount;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupExpiredDemoUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:cleanup-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete demo users whose accounts have expired';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Searching for expired demo users...');

        $expiredAccounts = DemoAccount::query()
            ->where('expires_at', '<', now())
            ->with('user')
            ->get();

        if ($expiredAccounts->isEmpty()) {
            $this->info('✅ No expired demo users found.');

            return self::SUCCESS;
        }

        $this->info("📋 Found {$expiredAccounts->count()} expired demo user(s).");

        $count = 0;

        foreach ($expiredAccounts as $demoAccount) {
            $user = $demoAccount->user;

            if ($user === null) {
                $demoAccount->delete();

                continue;
            }

            $email = $user->email;

            // recipes.user_id has no cascade: delete recipes first so the
            // RecipeObserver removes their images and planned meals.
            $user->recipes()->cursor()->each(fn ($recipe) => $recipe->delete());

            $user->delete(); // cascades demo_accounts, workspaces, planned meals, etc.
            $count++;

            Log::info('Expired demo user deleted', [
                'email' => $email,
                'expired_at' => $demoAccount->expires_at,
            ]);

            $this->line("  🗑️  Deleted: {$email}");
        }

        $this->newLine();
        $this->info("✅ Successfully deleted {$count} expired demo user(s).");

        return self::SUCCESS;
    }
}
