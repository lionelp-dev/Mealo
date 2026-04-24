<?php

namespace Tests\Concerns;

use App\Actions\Recipes\RecipeStoreAction;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Data\Requests\Recipe\RecipeUpdateRequestData;
use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Testing\File;

trait HasRecipeContext
{
    public Recipe $recipe;

    public Recipe $otherRecipe;

    public Recipe $otherUserRecipe;

    public File $image;

    public RecipeStoreRequestData $recipeStoreRequestData;

    public RecipeStoreRequestData $otherRecipeStoreRequestData;

    public RecipeUpdateRequestData $recipeUpdateRequestData;

    public function createRecipeContext()
    {
        $this->recipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());
        $this->otherRecipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());

        $this->recipe = app(RecipeStoreAction::class)->execute($this->user, $this->recipeStoreRequestData);
        $this->otherRecipe = app(RecipeStoreAction::class)->execute($this->user, $this->otherRecipeStoreRequestData);
        $this->otherUserRecipe = app(RecipeStoreAction::class)->execute($this->otherUser, $this->otherRecipeStoreRequestData);

        $this->recipeUpdateRequestData = $this->makeRecipeUpdateRequestDataFor($this->user);
    }

    public function makeRecipeUpdateRequestDataFor(
        User $user,
    ): RecipeUpdateRequestData {
        $recipeResourceData = RecipeResourceData::fromModel($this->recipe->load('ingredients', 'mealTimes', 'tags', 'steps'))->include('ingredients');
        $otherRecipeResourceData = RecipeResourceData::fromModel($this->otherRecipe->load('ingredients', 'mealTimes', 'tags', 'steps'))->include('ingredients');

        return RecipeUpdateRequestData::from([
            ...$recipeResourceData->except('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
            ...$otherRecipeResourceData->only('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
        ]);
    }
}
