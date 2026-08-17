<?php

namespace Tests\Feature\Recipe;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeImageAIGenerationAction;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Models\Recipe;
use Illuminate\Support\Facades\Storage;
use Mockery\MockInterface;

function fakeGeneratedRecipe(string $mealTimeName, string $name = 'AI Recipe'): RecipeStoreRequestData
{
    return RecipeStoreRequestData::validateAndCreate([
        'name' => $name,
        'description' => 'A tasty AI generated dish',
        'serving_size' => 2,
        'preparation_time' => 10,
        'cooking_time' => 20,
        'meal_times' => [['name' => $mealTimeName]],
        'ingredients' => [['name' => 'Tomato', 'quantity' => 2, 'unit' => 'piece']],
        'steps' => [['order' => 1, 'description' => 'Cook everything']],
        'tags' => [['name' => 'healthy']],
    ]);
}

describe('RecipeAIGenerateTest', function () {
    describe('authorization', function () {
        test('guests cannot generate recipes', function () {
            /** @var \Tests\TestCase $this */
            $this->post(route('recipes.ai-generate'), [])
                ->assertRedirect(route('login'));
        });
    });

    describe('generation', function () {
        test('generates and stores multiple recipes', function () {
            /** @var \Tests\TestCase $this */
            $mealTimeName = $this->mealTime->name;

            $this->mock(RecipeAIGenerationAction::class, function (MockInterface $mock) use ($mealTimeName) {
                $mock->shouldReceive('generate')->once()->andReturn([
                    fakeGeneratedRecipe($mealTimeName, 'AI Recipe 1'),
                    fakeGeneratedRecipe($mealTimeName, 'AI Recipe 2'),
                    fakeGeneratedRecipe($mealTimeName, 'AI Recipe 3'),
                ]);
            });

            $this->actingAs($this->user)
                ->post(route('recipes.ai-generate'), [
                    'prompt' => 'Some healthy dinner ideas',
                    'context' => ['meal_time' => $mealTimeName, 'count' => 3],
                    'image_generation' => false,
                ])
                ->assertSessionHas('success')
                ->assertSessionHasNoErrors();

            expect(Recipe::query()->where('user_id', $this->user->id)->count())->toBe(3);
        });

        test('attaches a generated image when requested', function () {
            /** @var \Tests\TestCase $this */
            Storage::fake('recipe_images');
            $mealTimeName = $this->mealTime->name;

            $this->mock(RecipeAIGenerationAction::class, function (MockInterface $mock) use ($mealTimeName) {
                $mock->shouldReceive('generate')->once()->andReturn([
                    fakeGeneratedRecipe($mealTimeName),
                ]);
            });

            $pngBase64 = base64_encode(
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
            );

            $this->mock(RecipeImageAIGenerationAction::class, function (MockInterface $mock) use ($pngBase64) {
                $mock->shouldReceive('execute')->once()
                    ->andReturn('data:image/png;base64,'.$pngBase64);
            });

            $this->actingAs($this->user)
                ->post(route('recipes.ai-generate'), [
                    'context' => ['meal_time' => $mealTimeName, 'count' => 1],
                    'image_generation' => true,
                ])
                ->assertSessionHas('success');

            $recipe = Recipe::query()->where('user_id', $this->user->id)->firstOrFail();
            expect($recipe->image_path)->not->toBeNull();
            Storage::disk('recipe_images')->assertExists($recipe->image_path);
        });
    });
});
