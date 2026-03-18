<?php

namespace App\Actions\Recipes;

use App\Data\Recipe\Entities\TagData;
use App\Models\Recipe;
use App\Models\Tag;

class SyncRecipeTagsAction
{
    /**
     * Sync tags for a recipe.
     *
     * @param  TagData[]  $tagsData
     */
    public function __invoke(Recipe $recipe, array $tagsData): void
    {
        if (! $recipe->user) {
            throw new \RuntimeException('Recipe must have a user to sync tags');
        }

        $tagIds = collect($tagsData)
            ->map(function (TagData $tagData) use ($recipe) {
                $tag = Tag::query()->firstOrCreate([
                    'user_id' => $recipe->user->id,
                    'name' => $tagData->name,
                ]);

                return $tag->id;
            });

        $recipe->tags()->sync($tagIds);
    }
}
