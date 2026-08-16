<?php

namespace Tests\Integration\Actions\Admin;

use App\Actions\Admin\UserDeleteAction;

use function Pest\Laravel\assertDatabaseMissing;
use function Tests\createRecipeFor;
use function Tests\createUserWithWorkspace;

describe('UserDeleteAction', function () {
    test('deletes the user along with their recipes', function () {
        /** @var \Tests\TestCase $this */
        $user = createUserWithWorkspace();
        $recipe = createRecipeFor($user);

        app(UserDeleteAction::class)->execute($user);

        assertDatabaseMissing('users', ['id' => $user->id]);
        assertDatabaseMissing('recipes', ['id' => $recipe->id]);
    });
});
