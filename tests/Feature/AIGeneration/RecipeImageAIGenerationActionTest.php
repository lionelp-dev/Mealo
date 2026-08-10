<?php

namespace Tests\Feature\AIGeneration;

use App\Actions\Recipes\RecipeImageAIGenerationAction;
use App\Exceptions\Recipe\RecipeImageGenerationException;
use Illuminate\Support\Collection;
use Laravel\Ai\Image;
use Laravel\Ai\Prompts\ImagePrompt;
use Laravel\Ai\Responses\Data\GeneratedImage;
use Laravel\Ai\Responses\Data\Meta;
use Laravel\Ai\Responses\Data\Usage;
use Laravel\Ai\Responses\ImageResponse;
use RuntimeException;

function recipeImageResponse(array $images): ImageResponse
{
    return new ImageResponse(
        new Collection($images),
        new Usage,
        new Meta('openrouter', 'google/gemini-2.5-flash-image'),
    );
}

function expectRecipeImageGenerationFailure(callable $callback, string $previousMessage): void
{
    try {
        $callback();
    } catch (RecipeImageGenerationException $exception) {
        expect($exception->getMessage())
            ->toBe('Unable to generate the recipe image right now.')
            ->and($exception->getPrevious()?->getMessage())
            ->toBe($previousMessage);

        return;
    }

    test()->fail('Expected recipe image generation to fail.');
}

beforeEach(function () {
    config([
        'ai.default_for_images' => 'openrouter',
        'ai.providers.openrouter.models.image.default' => 'google/gemini-2.5-flash-image',
    ]);
});

test('it generates a recipe image data url through the default image provider', function () {
    $base64Image = base64_encode('fake-image-content');

    Image::fake([
        recipeImageResponse([
            new GeneratedImage($base64Image, 'image/jpeg'),
        ]),
    ]);

    $dataUrl = app(RecipeImageAIGenerationAction::class)->execute('tarte aux pommes');

    expect($dataUrl)->toBe("data:image/jpeg;base64,{$base64Image}");

    Image::assertGenerated(function (ImagePrompt $prompt): bool {
        expect($prompt->provider->name())->toBe('openrouter')
            ->and($prompt->model)->toBe('google/gemini-2.5-flash-image')
            ->and($prompt->isSquare())->toBeTrue()
            ->and($prompt->quality)->toBe('low')
            ->and($prompt->contains('A professional food photography of tarte aux pommes'))->toBeTrue()
            ->and($prompt->contains('culinary magazine style'))->toBeTrue();

        return true;
    });
});

test('it falls back to png mime type when the generated image has no mime', function () {
    $base64Image = base64_encode('fake-image-content');

    Image::fake([
        recipeImageResponse([
            new GeneratedImage($base64Image),
        ]),
    ]);

    $dataUrl = app(RecipeImageAIGenerationAction::class)->execute('risotto');

    expect($dataUrl)->toBe("data:image/png;base64,{$base64Image}");
});

test('it wraps provider failures in a recipe image generation exception', function () {
    Image::fake([
        fn () => throw new RuntimeException('Provider timeout'),
    ]);

    expectRecipeImageGenerationFailure(
        fn () => app(RecipeImageAIGenerationAction::class)->execute('soupe'),
        'Provider timeout',
    );
});

test('it fails when no image is returned', function () {
    Image::fake([
        recipeImageResponse([]),
    ]);

    expectRecipeImageGenerationFailure(
        fn () => app(RecipeImageAIGenerationAction::class)->execute('soupe'),
        'No image returned by provider',
    );
});

test('it fails when generated image data is empty', function () {
    Image::fake([
        recipeImageResponse([
            new GeneratedImage(''),
        ]),
    ]);

    expectRecipeImageGenerationFailure(
        fn () => app(RecipeImageAIGenerationAction::class)->execute('soupe'),
        'Empty image data returned by provider',
    );
});

test('it fails when generated image data is not valid base64', function () {
    Image::fake([
        recipeImageResponse([
            new GeneratedImage('not-base64'),
        ]),
    ]);

    expectRecipeImageGenerationFailure(
        fn () => app(RecipeImageAIGenerationAction::class)->execute('soupe'),
        'Invalid base64 image data returned by provider',
    );
});

test('it fails when generated image exceeds the size limit', function () {
    Image::fake([
        recipeImageResponse([
            new GeneratedImage(base64_encode(str_repeat('a', (5 * 1024 * 1024) + 1))),
        ]),
    ]);

    expectRecipeImageGenerationFailure(
        fn () => app(RecipeImageAIGenerationAction::class)->execute('soupe'),
        'Generated image exceeds 5MB limit',
    );
});

test('it translates the shared recipe image generation exception message', function () {
    app()->setLocale('fr');

    Image::fake([
        recipeImageResponse([]),
    ]);

    try {
        app(RecipeImageAIGenerationAction::class)->execute('soupe');
    } catch (RecipeImageGenerationException $exception) {
        expect($exception->getMessage())
            ->toBe("Impossible de générer l'image de la recette pour le moment.");

        return;
    }

    test()->fail('Expected recipe image generation to fail.');
});
