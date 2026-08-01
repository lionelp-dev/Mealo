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
        if (! isset($this->recipeStoreRequestData)) {
            $this->recipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());
        }

        if (! isset($this->otherRecipeStoreRequestData)) {
            $this->otherRecipeStoreRequestData = RecipeStoreRequestData::from(Recipe::factory()->complete()->make());
        }
    }

    public function setUpRecipeContext(): void
    {
        if (isset($this->recipe)) {
            return;
        }

        $this->recipe = app(RecipeStoreAction::class)->execute($this->user, $this->recipeStoreRequestData);
    }

    public function setUpOtherRecipeContext(): void
    {
        if (isset($this->otherRecipe)) {
            return;
        }

        $this->otherRecipe = app(RecipeStoreAction::class)->execute($this->user, $this->otherRecipeStoreRequestData);
    }

    public function setUpOtherUserRecipeContext(): void
    {
        if (isset($this->otherUserRecipe)) {
            return;
        }

        $this->setUpOtherUserContext();

        $this->otherUserRecipe = app(RecipeStoreAction::class)->execute($this->otherUser, $this->otherRecipeStoreRequestData);
    }

    public function setUpEditorRecipeContext(): void
    {
        if (isset($this->editorRecipe)) {
            return;
        }

        $this->setUpEditorUserContext();

        $this->editorRecipe = app(RecipeStoreAction::class)->execute($this->editorUser, $this->recipeStoreRequestData);
    }

    public function setUpViewerRecipeContext(): void
    {
        if (isset($this->viewerRecipe)) {
            return;
        }

        $this->setUpViewerUserContext();

        $this->viewerRecipe = app(RecipeStoreAction::class)->execute($this->viewerUser, $this->recipeStoreRequestData);
    }

    public function setUpInviteeRecipeContext(): void
    {
        if (isset($this->inviteeRecipe)) {
            return;
        }

        $this->setUpInviteeUserContext();

        $this->inviteeRecipe = app(RecipeStoreAction::class)->execute($this->inviteeUser, $this->recipeStoreRequestData);
    }

    public function setUpRecipeUpdateRequestDataContext(): void
    {
        if (isset($this->recipeUpdateRequestData)) {
            return;
        }

        $this->setUpRecipeContext();
        $this->setUpOtherRecipeContext();

        $this->recipeUpdateRequestData = $this->makeRecipeUpdateRequestDataFor($this->user);
    }

    public function setUpRecipeImageContext(): void
    {
        if (isset($this->recipeImage)) {
            return;
        }

        Storage::fake('recipe_images');
        $this->recipeImage = UploadedFile::fake()->image('recipe.jpg', 800, 600);
    }

    public function setUpUploadedRecipeImageContext(): void
    {
        if (isset($this->recipeImagePath)) {
            return;
        }

        $this->setUpRecipeContext();
        $this->setUpRecipeImageContext();

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
