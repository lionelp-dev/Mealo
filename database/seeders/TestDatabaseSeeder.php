<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TestDatabaseSeeder extends Seeder
{
    /**
     * Seed the test database with essential data.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,  // First: create roles & permissions
            MealTimeSeeder::class,             // Required for recipe/meal planning tests
        ]);
    }
}