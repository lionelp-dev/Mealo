<?php

namespace Tests\Feature\Recipe;

use App\Models\User;
use Tests\TestCase;

test('', function () {
    /** @var TestCase $this * */
    $this->user = User::factory()->create();
    $response = $this->actingAs($this->user)->get('/recipes');
});
