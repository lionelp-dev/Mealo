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
            MealTimeSeeder::class,
            AdminSeeder::class,  // Create admin role and access-admin-panel permission
            UserSeeder::class,  // Users need roles to be assigned
            DemoInviteSeeder::class,  // Single demo share-link invite (from config)
        ]);
    }
}
