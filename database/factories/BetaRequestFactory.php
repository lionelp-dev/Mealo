<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BetaRequest>
 */
class BetaRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'status' => 'pending',
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    /**
     * Indicate that the beta request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the beta request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'token' => Str::random(32),
            'token_expires_at' => now()->addDays(7),
            'approved_by' => User::factory(),
            'approved_at' => now(),
        ]);
    }

    /**
     * Indicate that the beta request is rejected.
     */
    public function rejected(?string $reason = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $reason ?? 'Request does not meet requirements',
        ]);
    }

    /**
     * Indicate that the beta request is converted (user created).
     */
    public function converted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'converted',
            'token' => Str::random(32),
            'token_expires_at' => now()->subDays(1), // Expired
            'account_expires_at' => now()->addDays(30),
            'approved_by' => User::factory(),
            'approved_at' => now()->subDays(2),
            'user_id' => User::factory(),
        ]);
    }

    /**
     * Indicate that the beta account has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'account_expires_at' => now()->subDay(),
            'approved_by' => User::factory(),
            'approved_at' => now()->subDays(31),
        ]);
    }

    /**
     * Indicate that the account expires at a specific time.
     */
    public function expiresAt(\DateTime $date): static
    {
        return $this->state(fn (array $attributes) => [
            'account_expires_at' => $date,
        ]);
    }

    /**
     * Indicate that the token expires at a specific time.
     */
    public function tokenExpiresAt(\DateTime $date): static
    {
        return $this->state(fn (array $attributes) => [
            'token_expires_at' => $date,
        ]);
    }
}
