<?php

namespace App\Actions\Recipes;

use App\Models\Recipe;
use Illuminate\Http\UploadedFile;

class UploadRecipeImageAction
{
    public function __construct(
        private DeleteRecipeImageAction $deleteImageAction
    ) {}

    /**
     * Upload and store a recipe image.
     */
    public function __invoke(Recipe $recipe, UploadedFile $image): string
    {
        // Delete old image if exists
        ($this->deleteImageAction)($recipe);

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
}
