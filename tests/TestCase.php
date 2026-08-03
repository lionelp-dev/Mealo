<?php

namespace Tests;

use Database\Seeders\TestDatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\Concerns\HasPlannedMealContext;
use Tests\Concerns\HasRecipeContext;
use Tests\Concerns\HasShoppingListContext;
use Tests\Concerns\HasUserContext;
use Tests\Concerns\HasWorkspaceContext;

abstract class TestCase extends BaseTestCase
{
    use HasPlannedMealContext;
    use HasRecipeContext;
    use HasShoppingListContext;
    use HasUserContext;
    use HasWorkspaceContext;
    use RefreshDatabase;

    protected bool $seed = true;

    protected string $seeder = TestDatabaseSeeder::class;

    protected function setUp(): void
    {
        parent::setUp();

        $this->setUpHasUserContext();
        $this->setUpHasWorkspaceContext();
        $this->setUpHasRecipeContext();
        $this->setUpHasPlannedMealContext();
    }
}
