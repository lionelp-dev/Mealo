<?php

namespace App\Actions\Recipes;

use App\Models\Recipe;
use Illuminate\Support\Facades\Storage;

class DeleteRecipeImageAction
{
    /**
     * Delete the recipe image from storage and database.
     */
    public function __invoke(Recipe $recipe): void
    {
        if ($recipe->image_path) {
            Storage::disk('recipe_images')->delete($recipe->image_path);
            $recipe->update(['image_path' => null]);
        }
    }
}
