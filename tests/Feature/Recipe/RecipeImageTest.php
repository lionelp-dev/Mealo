<?php

use App\Models\Recipe;
use App\Models\User;
use Database\Seeders\MealTimeSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

require_once __DIR__.'/../../Helpers/RecipeHelpers.php';

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    $this->recipe = Recipe::factory()->create(['user_id' => $this->user->id]);
    $this->seed(MealTimeSeeder::class);

    Storage::fake('recipe_images');
});

test('user can upload image to their recipe', function () {
    $image = UploadedFile::fake()->image('recipe.jpg', 800, 600);

    $response = $this->actingAs($this->user)
        ->post(route('recipes.upload-image', $this->recipe), [
            'image' => $image,
        ]);

    $response->assertStatus(200);

    $this->recipe->refresh();
    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path);
});

test('user can view their recipe image', function () {
    $image = UploadedFile::fake()->image('recipe.jpg');
    $imagePath = $this->recipe->uploadImage($image);

    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $this->recipe));

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'image/jpeg');
});

test('user cannot upload image to other users recipe', function () {
    $otherRecipe = Recipe::factory()->create(['user_id' => $this->otherUser->id]);
    $image = UploadedFile::fake()->image('recipe.jpg');

    $response = $this->actingAs($this->user)
        ->post(route('recipes.upload-image', $otherRecipe), [
            'image' => $image,
        ]);

    $response->assertStatus(403);
});

test('user cannot view other users recipe image', function () {
    $otherRecipe = Recipe::factory()->create(['user_id' => $this->otherUser->id]);
    $image = UploadedFile::fake()->image('recipe.jpg');
    $otherRecipe->uploadImage($image);

    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $otherRecipe));

    $response->assertStatus(403);
});

test('guest cannot upload recipe image', function () {
    $image = UploadedFile::fake()->image('recipe.jpg');

    $response = $this->post(route('recipes.upload-image', $this->recipe), [
        'image' => $image,
    ]);

    $response->assertRedirect(route('login'));
});

test('guest cannot view recipe image', function () {
    $image = UploadedFile::fake()->image('recipe.jpg');
    $this->recipe->uploadImage($image);

    $response = $this->get(route('recipes.image', $this->recipe));

    $response->assertRedirect(route('login'));
});

test('upload image validates file type', function () {
    $textFile = UploadedFile::fake()->create('document.txt', 1024, 'text/plain');

    $response = $this->actingAs($this->user)
        ->postJson(route('recipes.upload-image', $this->recipe), [
            'image' => $textFile,
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

test('upload image validates file size', function () {
    $largeImage = UploadedFile::fake()->image('large.jpg', 2000, 2000)->size(6144); // 6MB

    $response = $this->actingAs($this->user)
        ->postJson(route('recipes.upload-image', $this->recipe), [
            'image' => $largeImage,
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

test('recipe creation with image uploads and stores image', function () {
    $image = UploadedFile::fake()->image('recipe.jpg');
    $recipeData = [
        'name' => 'Test Recipe with Image',
        'description' => 'A test recipe with an image',
        'serving_size' => 4,
        'preparation_time' => 30,
        'cooking_time' => 45,
        'meal_times' => [['name' => 'diner']],
        'ingredients' => [['name' => 'Tomato', 'quantity' => 2, 'unit' => 'pieces']],
        'steps' => [['order' => 1, 'description' => 'Wash tomatoes']],
        'tags' => [['name' => 'healthy']],
        'image' => $image,
    ];

    $response = $this->actingAs($this->user)
        ->post(route('recipes.store'), $recipeData);

    $response->assertStatus(302);
    $response->assertSessionHas('success');

    $recipe = Recipe::where('user_id', $this->user->id)
        ->where('name', 'Test Recipe with Image')
        ->first();
    expect($recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($recipe->image_path);
});

test('recipe update with image uploads and stores image', function () {
    $image = UploadedFile::fake()->image('updated.jpg');
    $recipeData = [
        'name' => $this->recipe->name,
        'description' => $this->recipe->description,
        'serving_size' => 4,
        'preparation_time' => $this->recipe->preparation_time,
        'cooking_time' => $this->recipe->cooking_time,
        'meal_times' => [['name' => 'diner']],
        'ingredients' => [['name' => 'Tomato', 'quantity' => 2, 'unit' => 'pieces']],
        'steps' => [['order' => 1, 'description' => 'Wash tomatoes']],
        'tags' => [['name' => 'healthy']],
        'image' => $image,
    ];

    $response = $this->actingAs($this->user)
        ->put(route('recipes.update', $this->recipe), $recipeData);

    $response->assertStatus(302);

    $this->recipe->refresh();
    expect($this->recipe->image_path)->not->toBeNull();
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path);
});

test('recipe update with image replaces old image', function () {
    $firstImage = UploadedFile::fake()->image('first.jpg');
    $firstImagePath = $this->recipe->uploadImage($firstImage);

    $secondImage = UploadedFile::fake()->image('second.jpg');
    $recipeData = [
        'name' => $this->recipe->name,
        'description' => $this->recipe->description,
        'serving_size' => 4,
        'preparation_time' => $this->recipe->preparation_time,
        'cooking_time' => $this->recipe->cooking_time,
        'meal_times' => [['name' => 'diner']],
        'ingredients' => [['name' => 'Tomato', 'quantity' => 2, 'unit' => 'pieces']],
        'steps' => [['order' => 1, 'description' => 'Wash tomatoes']],
        'tags' => [['name' => 'healthy']],
        'image' => $secondImage,
    ];

    $response = $this->actingAs($this->user)
        ->put(route('recipes.update', $this->recipe), $recipeData);

    $response->assertStatus(302);

    Storage::disk('recipe_images')->assertMissing($firstImagePath);

    $this->recipe->refresh();
    expect($this->recipe->image_path)->not->toBe($firstImagePath);
    Storage::disk('recipe_images')->assertExists($this->recipe->image_path);
});

test('viewing recipe image returns 404 when no image exists', function () {
    $response = $this->actingAs($this->user)
        ->get(route('recipes.image', $this->recipe));

    $response->assertStatus(404);
});

test('deleting recipe removes associated image', function () {
    $image = UploadedFile::fake()->image('recipe.jpg');
    $imagePath = $this->recipe->uploadImage($image);

    Storage::disk('recipe_images')->assertExists($imagePath);

    $response = $this->actingAs($this->user)
        ->delete(route('recipes.destroy'), [
            'recipe_ids' => [$this->recipe->id],
        ]);

    $response->assertStatus(302);
    Storage::disk('recipe_images')->assertMissing($imagePath);
});
