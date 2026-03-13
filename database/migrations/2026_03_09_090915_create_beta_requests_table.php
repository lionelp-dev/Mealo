<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beta_requests', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->enum('status', ['pending', 'approved', 'rejected', 'converted', 'expired'])
                ->default('pending')->index();

            // Token pour lien d'invitation
            $table->string('token', 32)->unique()->nullable();
            $table->timestamp('token_expires_at')->nullable();

            // Expiration du compte beta
            $table->timestamp('account_expires_at')->nullable();

            // Relations
            $table->foreignId('approved_by')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('user_id')->nullable()
                ->constrained()->nullOnDelete(); // Keep beta_request record when user is deleted

            // Métadonnées
            $table->text('rejection_reason')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            // Index pour les requêtes fréquentes
            $table->index(['token', 'token_expires_at']);
            $table->index(['status', 'account_expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beta_requests');
    }
};
