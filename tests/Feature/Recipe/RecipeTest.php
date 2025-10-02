<?php

namespace Tests\Feature\Recipe;

use App\Http\Requests\StoreRecipeRequest;
use Database\Seeders\MealTimeSeeder;
use Illuminate\Support\Facades\Validator;

require_once __DIR__ . '/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    $this->user = \App\Models\User::factory()->create();
    $this->otherUser = \App\Models\User::factory()->create();
    $this->seed(MealTimeSeeder::class);
    $this->storeRecipeRequestRules = (new StoreRecipeRequest())->rules();
});

// Helper function to reduce code duplication
function assertValidData(array $data, array $rules): void
{
    $validator = Validator::make($data, $rules);
    expect($validator->fails())->toBeFalse();
}

test('recipes screen can be rendered', function () {
    $response = $this->actingAs($this->user)->get(route('recipes.index'));
    $response->assertStatus(200);
});

test('create recipe screen can be rendered', function () {
    $response = $this->actingAs($this->user)->get(route('recipes.create'));
    $response->assertStatus(200);
});

test('user can create a recipe successfully', function () {
    $recipeData = makeRecipeResource()->toArray(request());

    // Validate recipe data structure is correct
    assertValidData($recipeData, $this->storeRecipeRequestRules);

    $response = $this->actingAs($this->user)->post(route('recipes.store'), $recipeData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.index'));
    $response->assertSessionHas('success', 'Recipe successfully created');
});

test('user cannot create recipe with invalid data', function () {
    $invalidData = [
        'name' => '',
        'description' => '',
        'preparation_time' => -1,
        'cooking_time' => -1,
    ];

    $response = $this->actingAs($this->user)->post(route('recipes.store'), $invalidData);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['name', 'description', 'preparation_time', 'cooking_time']);
});

test('show recipe screen can be rendered', function () {
    $recipe = createRecipeResource($this->user->id);

    // Validate recipe data is well-formed
    assertValidData($recipe->toArray(request()), $this->storeRecipeRequestRules);

    $response = $this->actingAs($this->user)->get(route('recipes.show', $recipe));
    $response->assertStatus(200);
});

test('edit recipe screen can be rendered', function () {
    $recipe = createRecipeResource($this->user->id, false);

    // Validate recipe data structure
    assertValidData($recipe->toArray(request()), $this->storeRecipeRequestRules);

    $response = $this->actingAs($this->user)->get(route('recipes.edit', $recipe));
    $response->assertStatus(200);
});

test('user can update a recipe successfully', function () {
    $recipe = createRecipeResource($this->user->id, false);

    $updatedData = $recipe->toArray(request());
    $updatedData['name'] = "Updated Recipe Name";
    $updatedData['description'] = "Updated Recipe Description";

    // Validate both original and updated data
    assertValidData($recipe->toArray(request()), $this->storeRecipeRequestRules);
    assertValidData($updatedData, $this->storeRecipeRequestRules);

    $response = $this->actingAs($this->user)->put(route('recipes.update', $recipe), $updatedData);

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.show', $recipe));
    $response->assertSessionHas('success', 'Recipe successfully updated');

    // Verify database was updated correctly
    $this->assertDatabaseHas('recipes', [
        'id' => $recipe->id,
        'name' => $updatedData['name'],
        'description' => $updatedData['description'],
    ]);
});

test('user can delete a recipe successfully', function () {
    $recipe = createRecipeResource($this->user->id, false);

    $response = $this->actingAs($this->user)->delete(route('recipes.destroy', $recipe));

    $response->assertStatus(302);
    $response->assertRedirect(route('recipes.index'));
    $response->assertSessionHas('success', 'Recipe successfully deleted');

    // Recipe should be removed from database
    $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
});

test('user cannot access other users recipes', function () {
    $recipe = createRecipeResource($this->otherUser->id, false);

    // Should not be able to view other user's recipe
    $response = $this->actingAs($this->user)->get(route('recipes.show', $recipe));
    $response->assertStatus(403);

    // Should not be able to edit other user's recipe
    $response = $this->actingAs($this->user)->get(route('recipes.edit', $recipe));
    $response->assertStatus(403);

    // Should not be able to delete other user's recipe
    $response = $this->actingAs($this->user)->delete(route('recipes.destroy', $recipe));
    $response->assertStatus(403);
});

test('user cannot update recipe with invalid data', function () {
    $recipe = createRecipeResource($this->user->id, false);

    $invalidData = [
        'name' => '',
        'description' => '',
        'preparation_time' => -1,
        'cooking_time' => -1,
    ];

    $response = $this->actingAs($this->user)->put(route('recipes.update', $recipe), $invalidData);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['name', 'description', 'preparation_time', 'cooking_time']);

    // Original recipe data should remain unchanged
    $this->assertDatabaseHas('recipes', [
        'id' => $recipe->id,
        'name' => $recipe->name,
        'description' => $recipe->description,
    ]);
});

test('user cannot update other users recipe', function () {
    $otherUserRecipe = createRecipeResource($this->otherUser->id, false);

    $updatedData = $otherUserRecipe->toArray(request());
    $updatedData['name'] = "Hacked Recipe Name";

    $response = $this->actingAs($this->user)->put(route('recipes.update', $otherUserRecipe), $updatedData);

    // Should be forbidden due to ownership policy
    $response->assertStatus(403);

    // Original recipe should remain unchanged
    $this->assertDatabaseHas('recipes', [
        'id' => $otherUserRecipe->id,
        'name' => $otherUserRecipe->name,
    ]);

    $this->assertDatabaseMissing('recipes', [
        'id' => $otherUserRecipe->id,
        'name' => "Hacked Recipe Name",
    ]);
});

test('guest cannot access recipe routes', function () {
    $recipe = createRecipeResource($this->user->id);

    // All recipe routes should redirect to login for unauthenticated users
    $this->get(route('recipes.index'))->assertRedirect(route('login'));
    $this->get(route('recipes.create'))->assertRedirect(route('login'));
    $this->get(route('recipes.show', $recipe))->assertRedirect(route('login'));
    $this->get(route('recipes.edit', $recipe))->assertRedirect(route('login'));
    $this->post(route('recipes.store'), $recipe->toArray(request()))->assertRedirect(route('login'));
    $this->put(route('recipes.update', $recipe), $recipe->toArray(request()))->assertRedirect(route('login'));
    $this->delete(route('recipes.destroy', $recipe))->assertRedirect(route('login'));
});
