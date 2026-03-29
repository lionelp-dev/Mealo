<?php

namespace Tests\Concerns;

use App\Actions\Recipes\StoreRecipeAction;
use App\Data\Requests\Recipe\StoreRecipeRequestData;
use App\Data\Requests\Recipe\UpdateRecipeRequestData;
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

    public StoreRecipeRequestData $storeRecipeRequestData;

    public StoreRecipeRequestData $otherStoreRecipeRequestData;

    public UpdateRecipeRequestData $updateRecipeRequestData;

    public function createRecipeContext()
    {
        $this->storeRecipeRequestData = StoreRecipeRequestData::from(Recipe::factory()->complete()->make());
        $this->otherStoreRecipeRequestData = StoreRecipeRequestData::from(Recipe::factory()->complete()->make());

        $this->recipe = app(StoreRecipeAction::class)->execute($this->user, $this->storeRecipeRequestData);
        $this->otherRecipe = app(StoreRecipeAction::class)->execute($this->user, $this->otherStoreRecipeRequestData);
        $this->otherUserRecipe = app(StoreRecipeAction::class)->execute($this->otherUser, $this->otherStoreRecipeRequestData);

        $this->updateRecipeRequestData = $this->makeUpdateRecipeRequestDataFor($this->user);
    }

    public function makeUpdateRecipeRequestDataFor(
        User $user,
    ): UpdateRecipeRequestData {
        $recipeResourceData = RecipeResourceData::fromModel($this->recipe->load('ingredients', 'mealTimes', 'tags', 'steps'))->include('ingredients');
        $otherRecipeResourceData = RecipeResourceData::fromModel($this->otherRecipe->load('ingredients', 'mealTimes', 'tags', 'steps'))->include('ingredients');

        return UpdateRecipeRequestData::from([
            ...$recipeResourceData->except('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
            ...$otherRecipeResourceData->only('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
        ]);
    }
}
