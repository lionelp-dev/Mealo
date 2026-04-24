<?php

namespace App\Http\Controllers;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeDestroyAction;
use App\Actions\Recipes\RecipeFiltersAction;
use App\Actions\Recipes\RecipeImageAIGenerationAction;
use App\Actions\Recipes\RecipeSearchAction;
use App\Actions\Recipes\RecipeSearchIngredientsAction;
use App\Actions\Recipes\RecipeSearchTagsAction;
use App\Actions\Recipes\RecipeStoreAction;
use App\Actions\Recipes\RecipeUpdateAction;
use App\Data\Requests\Recipe\Entities\MealTimeRequestData;
use App\Data\Requests\Recipe\RecipeAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeDestroyRequestData;
use App\Data\Requests\Recipe\RecipeEditRequestData;
use App\Data\Requests\Recipe\RecipeFiltersRequestData;
use App\Data\Requests\Recipe\RecipeImageAIGenerationRequestData;
use App\Data\Requests\Recipe\RecipeSearchRequestData;
use App\Data\Requests\Recipe\RecipeStoreRequestData;
use App\Data\Requests\Recipe\RecipeUpdateRequestData;
use App\Data\Resources\Recipe\Entities\IngredientResourceData;
use App\Data\Resources\Recipe\Entities\MealTimeResourceData;
use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Data\Resources\Recipe\Entities\TagResourceData;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\Tag;
use App\Traits\AuthUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    use AuthUser;

    public function index(
        RecipeFiltersRequestData $recipeFiltersRequestData,
        RecipeFiltersAction $recipeFiltersAction,
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchAction $recipeSearchAction
    ): Response {
        Gate::authorize('viewAny', Recipe::class);

        $recipeQuery = Recipe::query()
            ->where('user_id', $this->user()->id)
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);
        $recipeQuery = $recipeFiltersAction($this->user(), $recipeQuery, $recipeFiltersRequestData);
        $recipeQuery = $recipeSearchAction($this->user(), $recipeQuery, $recipeSearchRequestData);

        $tags = Tag::query()->where('user_id', $this->user()->id)->get();

        return Inertia::render('recipe/index', [
            'recipes' => Inertia::scroll(RecipeResourceData::collect($recipeQuery->paginate(15))),
            'tags' => TagResourceData::collect($tags),
        ]);
    }

    public function create(
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchIngredientsAction $recipeSearchIngredientsAction,
        RecipeSearchTagsAction $recipeSearchTagsAction,
    ): Response {
        Gate::authorize('create', Recipe::class);

        $ingredients = $recipeSearchIngredientsAction($this->user(), $recipeSearchRequestData->ingredients_search);
        $tags = $recipeSearchTagsAction($this->user(), $recipeSearchRequestData->tags_search);

        return Inertia::render(
            'recipe/create',
            [
                'meal_times' => MealTimeResourceData::collect(MealTime::all()),
                'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
                'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
            ]
        );
    }

    public function store(
        RecipeStoreRequestData $recipeStoreRequestData,
        RecipeStoreAction $recipeStoreAction
    ): RedirectResponse {
        Gate::authorize('create', Recipe::class);

        $recipe = $recipeStoreAction->execute($this->user(), $recipeStoreRequestData);

        return to_route('recipes.show', ['recipe' => $recipe->id])->with('success', 'Recipe successfully created');
    }

    public function aiImageGeneration(
        RecipeImageAIGenerationRequestData $recipeImageAIGenerationRequestData,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction
    ): RedirectResponse {
        Gate::authorize('create', Recipe::class);

        $prompt = $recipeImageAIGenerationRequestData->name.'with'.json_encode($recipeImageAIGenerationRequestData->ingredients);
        $base64Image = $recipeImageAIGenerationAction->execute($prompt);

        return back()->with([
            'generated_image_data_url' => $base64Image,
        ]);
    }

    public function showAIGenerationModal(
    ): RedirectResponse {
        return to_route('recipes.create')
            ->with([
                'show_recipe_ai_generation_modal' => true,
            ]);
    }

    public function aiGeneration(
        RecipeAIGenerationRequestData $recipeAIGenerationRequestData,
        RecipeAIGenerationAction $recipeAIGenerationAction,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
    ): Response|RedirectResponse {
        Gate::authorize('create', Recipe::class);

        try {
            $recipe = $recipeAIGenerationAction->execute($recipeAIGenerationRequestData);

            $prompt = $recipe->name.'with'.json_encode($recipe->ingredients);
            $base64Image = $recipeImageAIGenerationAction->execute($prompt);

            return Inertia::render(
                'recipe/create',
                [
                    'generated_recipe' => $recipe,
                    'generated_image_data_url' => $base64Image,
                    'show_recipe_ai_generation_modal' => false,
                ]
            );
        } catch (\Exception $e) {
            return to_route('recipes.create')
                ->with('error', $e->getMessage());
        }
    }

    public function show(Recipe $recipe): Response
    {
        Gate::authorize('view', $recipe);

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        return Inertia::render('recipe/show', [
            'recipe' => RecipeResourceData::from($recipe)->include('ingredients'),
        ]);
    }

    public function edit(
        Recipe $recipe,
        RecipeEditRequestData $formQuery,
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchIngredientsAction $recipeSearchIngredientsAction,
        RecipeSearchTagsAction $recipeSearchTagsAction,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
    ): Response {
        Gate::authorize('update', $recipe);

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        $ingredients = $recipeSearchIngredientsAction($this->user(), $recipeSearchRequestData->ingredients_search);
        $tags = $recipeSearchTagsAction($this->user(), $recipeSearchRequestData->tags_search);

        return Inertia::render('recipe/edit', [
            'meal_times' => MealTimeRequestData::collect(MealTime::all()),
            'recipe' => RecipeResourceData::from($recipe)->include('ingredients'),
            'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
            'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
        ]);
    }

    public function update(
        Recipe $recipe,
        RecipeUpdateRequestData $recipeUpdateRequestData,
        RecipeUpdateAction $recipeUpdateAction
    ): RedirectResponse {
        Gate::authorize('update', $recipe);

        $recipeUpdateAction->execute(
            $recipe,
            $recipeUpdateRequestData,
        );

        return to_route('recipes.show', ['recipe' => $recipe])->with('success', 'Recipe successfully updated');
    }

    public function destroy(
        RecipeDestroyRequestData $recipeDestroyRequestData,
        RecipeDestroyAction $recipeDestroyAction
    ): RedirectResponse {

        $recipeDestroyAction->execute($this->user(), $recipeDestroyRequestData);

        return to_route('recipes.index')->with('success', 'Recipe successfully deleted');
    }

    public function image(
        Recipe $recipe
    ): HttpResponse {

        if ($recipe->user_id !== $this->user()->id) {
            abort(403, 'Unauthorized access to this recipe image');
        }

        if (! $recipe->image_path) {
            abort(404, 'Image not found');
        }

        if (! Storage::disk('recipe_images')->exists($recipe->image_path)) {
            abort(404, 'Image not found');
        }

        $file = Storage::disk('recipe_images')->get($recipe->image_path);

        $fullPath = Storage::disk('recipe_images')->path($recipe->image_path);

        $mimeType = mime_content_type($fullPath);

        return response($file, 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=86400', // Cache for 1 day
        ]);
    }
}
