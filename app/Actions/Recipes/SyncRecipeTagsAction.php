<?php

namespace App\Actions\Recipes;

use App\Data\Requests\Recipe\Entities\TagRequestData;
use App\Models\Recipe;
use App\Models\Tag;

class SyncRecipeTagsAction
{
    /**
     * Sync tags for a recipe.
     *
     * @param  array<TagRequestData>  $tagsData
     */
    public function __invoke(Recipe $recipe, array $tagsData): void
    {
        if (! $recipe->user) {
            throw new \RuntimeException('Recipe must have a user to sync tags');
        }

        $tagIds = collect($tagsData)
            ->map(function (TagRequestData $tagData) use ($recipe): int {
                $tag = Tag::query()->firstOrCreate([
                    'user_id' => $recipe->user->id,
                    'name' => $tagData->name,
                ]);

                return $tag->id;
            });

        $recipe->tags()->sync($tagIds);
    }
}
