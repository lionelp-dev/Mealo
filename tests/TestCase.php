<?php

namespace Tests;

use Database\Seeders\TestDatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\Concerns\HasRecipeContext;
use Tests\Concerns\HasUserContext;
use Tests\Concerns\HasWorkspaceContext;

abstract class TestCase extends BaseTestCase
{
    use HasRecipeContext;
    use HasUserContext;
    use HasWorkspaceContext;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TestDatabaseSeeder::class);
    }
}
