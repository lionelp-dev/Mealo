<?php

namespace Tests\Feature\Recipe;

use App\Http\Requests\StoreRecipeRequest;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

// No require_once needed — helpers are auto-loaded from tests/Pest.php

beforeEach(function () {
    /** @var \TestCase $this */
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    $this->storeRecipeRequestRules = (new StoreRecipeRequest)->rules();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test('recipes screen can be rendered', function () {
    /** @var \TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.index'))
        ->assertOk();
});

test('create recipe screen can be rendered', function () {
    /** @var \TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.create'))
        ->assertOk();
});

test('show recipe screen can be rendered', function () {
    /** @var \TestCase $this */
    $recipe = recipeResourceFor($this->user);

    $this->actingAs($this->user)
        ->get(route('recipes.show', $recipe))
        ->assertOk();
});

test('edit recipe screen can be rendered', function () {
    /** @var \TestCase $this */
    $recipe = recipeResourceFor($this->user);

    $this->actingAs($this->user)
        ->get(route('recipes.edit', $recipe))
        ->assertOk();
});

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------

test('guest cannot access recipe routes', function () {
    /** @var \TestCase $this */
    $recipe = recipeResourceFor($this->user);

    $this->get(route('recipes.index'))->assertRedirect(route('login'));
    $this->get(route('recipes.create'))->assertRedirect(route('login'));
    $this->get(route('recipes.show', $recipe))->assertRedirect(route('login'));
    $this->get(route('recipes.edit', $recipe))->assertRedirect(route('login'));
    $this->post(route('recipes.store'), $recipe->toArray(request()))->assertRedirect(route('login'));
    $this->put(route('recipes.update', $recipe), $recipe->toArray(request()))->assertRedirect(route('login'));
    $this->delete(route('recipes.destroy', $recipe))->assertRedirect(route('login'));
});

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

test('user can create a recipe successfully', function () {
    /** @var \TestCase $this */
    $payload = recipeResourceFor($this->user)->toArray(request());

    // Sanity check: the factory-built payload satisfies the form request rules.
    $validator = Validator::make($payload, $this->storeRecipeRequestRules);
    expect($validator->fails())->toBeFalse();

    $this->actingAs($this->user)
        ->post(route('recipes.store'), $payload)
        ->assertRedirect(route('recipes.index'))
        ->assertSessionHas('success', 'Recipe successfully created');
});

test('user cannot create recipe with invalid data', function () {
    /** @var \TestCase $this */
    $this->actingAs($this->user)
        ->post(route('recipes.store'), [
            'name' => '',
            'description' => '',
            'preparation_time' => -1,
            'cooking_time' => -1,
            'serving_size' => -1,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['name', 'description', 'preparation_time', 'cooking_time', 'serving_size']);
});

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

test('user can update a recipe successfully', function () {
    /** @var \TestCase $this */
    $recipe = recipeResourceFor($this->user);
    $payload = array_merge($recipe->toArray(request()), [
        'name' => 'Updated Recipe Name',
        'description' => 'Updated Recipe Description',
    ]);

    $this->actingAs($this->user)
        ->put(route('recipes.update', $recipe), $payload)
        ->assertRedirect(route('recipes.show', $recipe))
        ->assertSessionHas('success', 'Recipe successfully updated');

    $this->assertDatabaseHas('recipes', [
        'id' => $recipe->id,
        'name' => 'Updated Recipe Name',
        'description' => 'Updated Recipe Description',
    ]);
});

test('user cannot update recipe with invalid data', function () {
    /** @var \TestCase $this */
    $recipe = recipeResourceFor($this->user);

    $this->actingAs($this->user)
        ->put(route('recipes.update', $recipe), [
            'name' => '',
            'description' => '',
            'preparation_time' => -1,
            'cooking_time' => -1,
            'serving_size' => -1,
        ])
        ->assertRedirect()
        ->assertSessionHasErrors(['name', 'description', 'preparation_time', 'cooking_time', 'serving_size']);

    // Original data must remain unchanged.
    $this->assertDatabaseHas('recipes', [
        'id' => $recipe->id,
        'name' => $recipe->name,
        'description' => $recipe->description,
    ]);
});

test('user cannot update other users recipe', function () {
    /** @var \TestCase $this */
    $otherRecipe = recipeResourceFor($this->otherUser);
    $payload = array_merge($otherRecipe->toArray(request()), ['name' => 'Any Recipe Name']);

    $this->actingAs($this->user)
        ->put(route('recipes.update', $otherRecipe->resource), $payload)
        ->assertForbidden();

    $this->assertDatabaseHas('recipes', [
        'id' => $otherRecipe->resource->id,
        'name' => $otherRecipe->resource->name,
    ]);
});

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

test('user can delete a recipe successfully', function () {
    /** @var \TestCase $this */
    $recipe = createRecipeFor($this->user);

    $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), ['recipe_ids' => [$recipe->id]])
        ->assertRedirect(route('recipes.index'))
        ->assertSessionHas('success', 'Recipe successfully deleted');

    $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------

test('user cannot access other users recipes', function () {
    /** @var \TestCase $this */
    $otherRecipe = createRecipeFor($this->otherUser);

    $this->actingAs($this->user)
        ->get(route('recipes.show', $otherRecipe))
        ->assertForbidden();

    $this->actingAs($this->user)
        ->get(route('recipes.edit', $otherRecipe))
        ->assertForbidden();

    // Delete is silently ignored for recipes the user does not own.
    $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), ['recipe_ids' => [$otherRecipe->id]])
        ->assertRedirect();

    $this->assertDatabaseHas('recipes', ['id' => $otherRecipe->id]);
});
