<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShoppingList>
 */
class ShoppingListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::factory()->create();
        $workspace = $user->defaultWorkspace() ?? Workspace::createPersonalWorkspace($user);
        $weekStart = Carbon::instance($this->faker->dateTimeBetween('-2 weeks', '+2 weeks'))->startOfWeek();

        return [
            'user_id' => $user->id,
            'workspace_id' => $workspace->id,
            'week_start' => $weekStart->toDateString(),
        ];
    }
}
