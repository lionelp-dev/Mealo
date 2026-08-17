<?php

namespace App\Actions\Recipes;

use App\Models\Recipe;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class RecipeUploadImageAction
{
    public function __construct(
        private RecipeImageDeleteAction $recipeImageDeleteAction
    ) {}

    /**
     * Upload and store a recipe image.
     */
    public function __invoke(Recipe $recipe, UploadedFile $image): string
    {
        // Delete old image if exists
        ($this->recipeImageDeleteAction)($recipe);

        // Generate filename and directory
        $filename = 'recipe_'.$recipe->id.'_'.$image->hashName();
        $directory = 'user_'.$recipe->user_id;

        // Store the image
        $path = $image->storeAs($directory, $filename, 'recipe_images');

        if ($path === false) {
            throw new \RuntimeException('Failed to store recipe image');
        }

        // Update recipe with new path
        $recipe->update(['image_path' => $path]);

        return $path;
    }

    public function fromDataUrl(Recipe $recipe, string $dataUrl): string
    {
        if (! preg_match('/^data:(?<mime>image\/(?:jpeg|jpg|png));base64,(?<data>.+)$/s', $dataUrl, $matches)) {
            throw new RuntimeException('Generated image data URL is invalid.');
        }

        $contents = base64_decode($matches['data'], true);

        if ($contents === false) {
            throw new RuntimeException('Generated image data URL contains invalid base64.');
        }

        ($this->recipeImageDeleteAction)($recipe);

        // The regex above guarantees a full "image/..." mime; annotate as a plain
        // string so PHPStan doesn't mis-narrow the captured group to a literal union.
        /** @var string $mime */
        $mime = $matches['mime'];

        $extension = match ($mime) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/png' => 'png',
            default => throw new RuntimeException('Generated image has an unsupported mime type.'),
        };

        $path = 'user_'.$recipe->user_id.'/recipe_'.$recipe->id.'_generated_'.bin2hex(random_bytes(8)).'.'.$extension;

        if (! Storage::disk('recipe_images')->put($path, $contents)) {
            throw new RuntimeException('Failed to store generated recipe image');
        }

        $recipe->update(['image_path' => $path]);

        return $path;
    }
}
