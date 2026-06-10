<?php

namespace Tests\Concerns;

use App\Actions\Recipes\RecipeStoreAction;
use App\Actions\Recipes\RecipeUploadImageAction;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Data\Requests\Recipe\RecipeUpdateRequestData;
use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Testing\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HasRecipeContext
{
    public Recipe $recipe;

    public Recipe $otherRecipe;

    public Recipe $otherUserRecipe;

    public Recipe $editorRecipe;

    public Recipe $viewerRecipe;

    public Recipe $inviteeRecipe;

    public File $recipeImage;

    public string $recipeImagePath;

    public RecipeStoreRequestData $recipeStoreRequestData;

    public RecipeStoreRequestData $otherRecipeStoreRequestData;

    public RecipeUpdateRequestData $recipeUpdateRequestData;

    public function setUpHasRecipeContext(): void
    {
        $this->recipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());
        $this->otherRecipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());

        $this->recipe = app(RecipeStoreAction::class)->execute($this->user, $this->recipeStoreRequestData);
        $this->otherRecipe = app(RecipeStoreAction::class)->execute($this->user, $this->otherRecipeStoreRequestData);
        $this->otherUserRecipe = app(RecipeStoreAction::class)->execute($this->otherUser, $this->otherRecipeStoreRequestData);
        $this->editorRecipe = app(RecipeStoreAction::class)->execute($this->editorUser, $this->recipeStoreRequestData);
        $this->viewerRecipe = app(RecipeStoreAction::class)->execute($this->viewerUser, $this->recipeStoreRequestData);
        $this->inviteeRecipe = app(RecipeStoreAction::class)->execute($this->inviteeUser, $this->recipeStoreRequestData);

        $this->recipeUpdateRequestData = $this->makeRecipeUpdateRequestDataFor($this->user);

        Storage::fake('recipe_images');
        $this->recipeImage = UploadedFile::fake()->image('recipe.jpg', 800, 600);
        $this->recipeImagePath = (app(RecipeUploadImageAction::class))($this->recipe, $this->recipeImage);
    }

    public function makeRecipeUpdateRequestDataFor(
        User $user,
    ): RecipeUpdateRequestData {
        $recipeResourceData = RecipeResourceData::fromModel(
            $this->recipe->load('ingredients', 'mealTimes', 'tags', 'steps')
        )->include('ingredients');

        $otherRecipeResourceData = RecipeResourceData::fromModel(
            $this->otherRecipe->load('ingredients', 'mealTimes', 'tags', 'steps')
        )->include('ingredients');

        return RecipeUpdateRequestData::from([
            ...$recipeResourceData->except('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
            ...$otherRecipeResourceData->only('ingredients', 'mealTimes', 'tags', 'steps')->transform(),
        ]);
    }
}
