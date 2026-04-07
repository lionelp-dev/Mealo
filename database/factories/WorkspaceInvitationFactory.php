<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkspaceInvitation>
 */
class WorkspaceInvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'workspace_id' => Workspace::factory(),
            'email' => fake()->unique()->safeEmail(),
            'role' => 'editor',
            'invited_by' => User::factory(),
            'token' => (string) Str::uuid(),
            'expires_at' => now()->addDays(7),
        ];
    }

    /**
     * Indicate that the invitation is for an editor role.
     */
    public function editor(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'editor',
        ]);
    }

    /**
     * Indicate that the invitation is for a viewer role.
     */
    public function viewer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'viewer',
        ]);
    }

    /**
     * Indicate that the invitation is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subHour(),
        ]);
    }

    /**
     * Indicate that the invitation expires at a specific time.
     */
    public function expiresAt(\DateTime $date): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $date,
        ]);
    }
}
