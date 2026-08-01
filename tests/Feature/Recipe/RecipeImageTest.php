<?php

use App\Actions\Recipes\RecipeUploadImageAction;
use App\Models\Recipe;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->setUpRecipeUpdateRequestDataContext();
    $this->setUpOtherUserRecipeContext();
    $this->setUpRecipeImageContext();
});

test('user can upload image to their recipe', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->recipe),
            [
                ...$this->recipeUpdateRequestData->except('image')->transform(),
                'image' => $this->recipeImage,
            ]
        )->assertStatus(302);

    $this->recipe->refresh();

    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path ?? '');
});

test('user can view their recipe image', function () {
    /** @var \Tests\TestCase $this */
    $imagePath = (app(RecipeUploadImageAction::class))($this->recipe, $this->recipeImage);

    $this->actingAs($this->user)
        ->get(route('recipes.image', $this->recipe))
        ->assertStatus(200)
        ->assertHeader('Content-Type', 'image/jpeg');
});

test('user cannot upload image to other users recipe', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->otherUserRecipe),
            [
                ...$this->recipeUpdateRequestData->except('image')->transform(),
                'image' => $this->recipeImage,
            ]
        )->assertSessionHas('error');
});

test('user cannot view other users recipe image', function () {
    /** @var \Tests\TestCase $this */
    (app(RecipeUploadImageAction::class))($this->otherUserRecipe, $this->recipeImage);

    $this->actingAs($this->user)
        ->get(route('recipes.image', $this->otherUserRecipe))
        ->assertStatus(403);
});

test('guest cannot upload recipe image', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->put(
        route('recipes.update', $this->recipe),
        [
            ...$this->recipeUpdateRequestData->transform(),
            'image' => $this->recipeImage,
        ]
    )->assertRedirect(route('login'));
});

test('guest cannot view recipe image', function () {
    /** @var \Tests\TestCase $this */
    (app(RecipeUploadImageAction::class))($this->recipe, $this->recipeImage);

    $this->get(route('recipes.image', $this->recipe))
        ->assertRedirect(route('login'));
});

test('upload image validates file type', function () {
    /** @var \Tests\TestCase $this */
    $textFile = UploadedFile::fake()->create('document.txt', 1024, 'text/plain');

    $response = $this->actingAs($this->user)
        ->putJson(
            route('recipes.update', $this->recipe),
            [
                ...$this->recipeUpdateRequestData->transform(),
                'image' => $textFile,
            ]
        )
        ->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

test('upload image validates file size', function () {
    /** @var \Tests\TestCase $this */
    $largeImage = UploadedFile::fake()->image('large.jpg', 2000, 2000)->size(6144); // 6MB

    $response = $this->actingAs($this->user)
        ->putJson(
            route('recipes.update', $this->recipe),
            [
                ...$this->recipeUpdateRequestData->transform(),
                'image' => $largeImage,
            ]
        )
        ->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

test('recipe creation with image uploads and stores image', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->post(
            route('recipes.store'),
            [
                ...$this->recipeStoreRequestData->except('image')->transform(),
                'image' => $this->recipeImage,
            ]
        )
        ->assertStatus(302)
        ->assertSessionHas('success');

    /** @var string $redirectUrl */
    $redirectUrl = $response->headers->get('Location');

    /** @var string $path */
    $path = parse_url($redirectUrl, PHP_URL_PATH);

    $request = \Illuminate\Http\Request::create($path, 'GET');
    $route = app('router')->getRoutes()->match($request);

    /** @var string $recipeId */
    $recipeId = $route->parameter('recipe');

    /** @var Recipe $recipe */
    $recipe = Recipe::query()->where('id', $recipeId)->first();

    expect($recipe->image_path)->not->toBeNull();

    Storage::disk('recipe_images')->assertExists($recipe->image_path ?? '');
});

test('recipe update with image uploads and stores image', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->recipe),
            [
                ...$this->recipeUpdateRequestData->except('image')->transform(),
                'image' => $this->recipeImage,
            ]
        )
        ->assertStatus(302);

    $this->recipe->refresh();

    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path ?? '');
});

test('viewing recipe image returns 404 when no image exists', function () {
    /** @var \Tests\TestCase $this */
    $this->actingAs($this->user)
        ->get(route('recipes.image', $this->otherRecipe))
        ->assertStatus(404);
});

test('deleting recipe removes associated image', function () {
    /** @var \Tests\TestCase $this */
    $imagePath = (app(RecipeUploadImageAction::class))($this->recipe, $this->recipeImage);

    Storage::disk('recipe_images')->assertExists($imagePath);

    $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), [
            'ids' => [$this->recipe->id],
        ])
        ->assertStatus(302);

    Storage::disk('recipe_images')->assertMissing($imagePath);
});
