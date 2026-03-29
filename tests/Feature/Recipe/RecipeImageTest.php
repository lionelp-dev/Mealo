<?php

use App\Actions\Recipes\UploadRecipeImageAction;
use App\Models\Recipe;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    /** @var \Tests\TestCase $this */
    $this->createUserContext();
    $this->createRecipeContext();

    Storage::fake('recipe_images');
    $this->image = UploadedFile::fake()->image('image.jpg', 800, 600);
});

test('user can upload image to their recipe', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->recipe),
            [
                ...$this->updateRecipeRequestData->except('image')->transform(),
                'image' => $this->image,
            ]
        );

    $response->assertStatus(302);

    $this->recipe->refresh();

    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path ?? '');
});

test('user can view their recipe image', function () {
    /** @var \Tests\TestCase $this */
    $imagePath = (app(UploadRecipeImageAction::class))($this->recipe, $this->image);

    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $this->recipe));

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'image/jpeg');
});

test('user cannot upload image to other users recipe', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->otherUserRecipe),
            [
                ...$this->updateRecipeRequestData->except('image')->transform(),
                'image' => $this->image,
            ]
        );

    $response->assertStatus(403);
});

test('user cannot view other users recipe image', function () {
    /** @var \Tests\TestCase $this */
    (app(UploadRecipeImageAction::class))($this->otherUserRecipe, $this->image);

    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $this->otherUserRecipe));

    $response->assertStatus(403);
});

test('guest cannot upload recipe image', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->put(
        route('recipes.update', $this->recipe),
        [
            ...$this->updateRecipeRequestData->transform(),
            'image' => $this->image,
        ]
    );

    $response->assertRedirect(route('login'));
});

test('guest cannot view recipe image', function () {
    /** @var \Tests\TestCase $this */
    (app(UploadRecipeImageAction::class))($this->recipe, $this->image);

    $response = $this->get(route('recipes.image', $this->recipe));

    $response->assertRedirect(route('login'));
});

test('upload image validates file type', function () {
    /** @var \Tests\TestCase $this */
    $textFile = UploadedFile::fake()->create('document.txt', 1024, 'text/plain');

    $response = $this->actingAs($this->user)
        ->putJson(
            route('recipes.update', $this->recipe),
            [
                ...$this->updateRecipeRequestData->transform(),
                'image' => $textFile,
            ]
        );

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

test('upload image validates file size', function () {
    /** @var \Tests\TestCase $this */
    $largeImage = UploadedFile::fake()->image('large.jpg', 2000, 2000)->size(6144); // 6MB

    $response = $this->actingAs($this->user)
        ->putJson(
            route('recipes.update', $this->recipe),
            [
                ...$this->updateRecipeRequestData->transform(),
                'image' => $largeImage,
            ]
        );

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

test('recipe creation with image uploads and stores image', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->post(
            route('recipes.store'),
            [
                ...$this->storeRecipeRequestData->except('image')->transform(),
                'image' => $this->image,
            ]
        );

    $response->assertStatus(302);
    $response->assertSessionHas('success');

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
    $response = $this->actingAs($this->user)
        ->put(
            route('recipes.update', $this->recipe),
            [
                ...$this->updateRecipeRequestData->except('image')->transform(),
                'image' => $this->image,
            ]
        );

    $response->assertStatus(302);

    $this->recipe->refresh();

    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path ?? '');
});

test('viewing recipe image returns 404 when no image exists', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $this->recipe));

    $response->assertStatus(404);
});

test('deleting recipe removes associated image', function () {
    /** @var \Tests\TestCase $this */
    $imagePath = (app(UploadRecipeImageAction::class))($this->recipe, $this->image);

    Storage::disk('recipe_images')->assertExists($imagePath);

    $response = $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), [
            'ids' => [$this->recipe->id],
        ]);

    $response->assertStatus(302);
    Storage::disk('recipe_images')->assertMissing($imagePath);
});
