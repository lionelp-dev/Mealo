<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,  // First: create roles & permissions
            AdminRoleSeeder::class,  // Create admin role and access-admin-panel permission
            MealTimeSeeder::class,
            UserSeeder::class,  // Users need roles to be assigned
        ]);
    }
}
