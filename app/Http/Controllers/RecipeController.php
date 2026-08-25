<?php

namespace App\Http\Controllers;

use App\Actions\Recipes\RecipeAIGenerationAction;
use App\Actions\Recipes\RecipeDestroyAction;
use App\Actions\Recipes\RecipeFiltersAction;
use App\Actions\Recipes\RecipeGenerationSessionState;
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
use App\Data\Resources\Recipe\Entities\IngredientCategoryResourceData;
use App\Data\Resources\Recipe\Entities\IngredientResourceData;
use App\Data\Resources\Recipe\Entities\MealTimeResourceData;
use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Data\Resources\Recipe\Entities\TagResourceData;
use App\Http\Controllers\Concerns\HasAuthenticatedUser;
use App\Jobs\RecipeAIGenerationJob;
use App\Messages\Recipe\RecipeCreatedMessage;
use App\Messages\Recipe\RecipeDeletedMessage;
use App\Messages\Recipe\RecipeGenerationFailedMessage;
use App\Messages\Recipe\RecipeGenerationQueuedMessage;
use App\Messages\Recipe\RecipeUpdatedMessage;
use App\Models\IngredientCategory;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\Tag;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    use HasAuthenticatedUser;

    public function index(
        RecipeFiltersRequestData $recipeFiltersRequestData,
        RecipeFiltersAction $recipeFiltersAction,
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchAction $recipeSearchAction,
        Request $request,
    ): Response {
        Gate::authorize('viewAny', Recipe::class);

        $recipeQuery = Recipe::query()
            ->where('user_id', $this->authenticatedUser()->id)
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);
        $recipeQuery = $recipeFiltersAction($this->authenticatedUser(), $recipeQuery, $recipeFiltersRequestData);
        $recipeQuery = $recipeSearchAction($this->authenticatedUser(), $recipeQuery, $recipeSearchRequestData);

        $tags = Tag::query()->where('user_id', $this->authenticatedUser()->id)->get();
        $selectedRecipeId = $request->query('recipe');
        $selectedRecipe = null;

        if (is_string($selectedRecipeId) && $selectedRecipeId !== '') {
            $selectedRecipe = Recipe::query()
                ->whereKey($selectedRecipeId)
                ->with(['mealTimes', 'ingredients', 'steps', 'tags'])
                ->first();

            if ($selectedRecipe && Gate::denies('view', $selectedRecipe)) {
                $selectedRecipe = null;
            }
        }

        return Inertia::render('recipe/index', [
            'recipes' => Inertia::scroll($recipeQuery->paginate(15)->through(
                fn (Recipe $recipe) => RecipeResourceData::from($recipe)->include('ingredients')
            )),
            'selected_recipe' => $selectedRecipe ? RecipeResourceData::from($selectedRecipe)->include('ingredients') : null,
            'tags' => TagResourceData::collect($tags),
            'meal_times' => MealTimeResourceData::collect(MealTime::all()),
        ]);
    }

    public function create(
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchIngredientsAction $recipeSearchIngredientsAction,
        RecipeSearchTagsAction $recipeSearchTagsAction,
    ): Response {
        Gate::authorize('create', Recipe::class);

        $ingredients = $recipeSearchIngredientsAction($this->authenticatedUser(), $recipeSearchRequestData->ingredients_search);
        $tags = $recipeSearchTagsAction($this->authenticatedUser(), $recipeSearchRequestData->tags_search);

        return Inertia::render(
            'recipe/create',
            [
                'meal_times' => MealTimeResourceData::collect(MealTime::all()),
                'ingredient_categories' => IngredientCategoryResourceData::collect(IngredientCategory::query()->orderBy('id')->get()),
                'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
                'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
            ]
        );
    }

    public function store(
        RecipeStoreRequestData $recipeStoreRequestData,
        RecipeStoreAction $recipeStoreAction
    ): RedirectResponse {
        try {
            Gate::authorize('create', Recipe::class);

            $recipe = $recipeStoreAction->execute($this->authenticatedUser(), $recipeStoreRequestData);

            return to_route('recipes.index', ['recipe' => $recipe->id])
                ->with('success', RecipeCreatedMessage::message());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function edit(
        Recipe $recipe,
        RecipeEditRequestData $formQuery,
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchIngredientsAction $recipeSearchIngredientsAction,
        RecipeSearchTagsAction $recipeSearchTagsAction,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
    ): Response|RedirectResponse {
        try {
            Gate::authorize('update', $recipe);

            $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

            $ingredients = $recipeSearchIngredientsAction($this->authenticatedUser(), $recipeSearchRequestData->ingredients_search);
            $tags = $recipeSearchTagsAction($this->authenticatedUser(), $recipeSearchRequestData->tags_search);

            return Inertia::render('recipe/edit', [
                'meal_times' => MealTimeRequestData::collect(MealTime::all()),
                'ingredient_categories' => IngredientCategoryResourceData::collect(IngredientCategory::query()->orderBy('id')->get()),
                'recipe' => RecipeResourceData::from($recipe)->include('ingredients'),
                'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
                'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
            ]);
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(
        Recipe $recipe,
        RecipeUpdateRequestData $recipeUpdateRequestData,
        RecipeUpdateAction $recipeUpdateAction
    ): RedirectResponse {
        try {
            Gate::authorize('update', $recipe);

            $recipeUpdateAction->execute(
                $recipe,
                $recipeUpdateRequestData,
            );

            return to_route('recipes.index', ['recipe' => $recipe->id])
                ->with('success', RecipeUpdatedMessage::message());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(
        RecipeDestroyRequestData $recipeDestroyRequestData,
        RecipeDestroyAction $recipeDestroyAction
    ): RedirectResponse {
        try {
            $recipeDestroyAction->execute($this->authenticatedUser(), $recipeDestroyRequestData);

            return to_route('recipes.index')
                ->with('success', RecipeDeletedMessage::message());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function image(
        Recipe $recipe
    ): HttpResponse|RedirectResponse {
        Gate::authorize('view', $recipe);

        if (! $recipe->image_path) {
            abort(404, 'Image not found');
        }

        $disk = Storage::disk('recipe_images');

        // On object storage (DigitalOcean Spaces / S3), offload serving to a short-lived signed
        // URL. We skip an exists() check because HeadObject on a missing key can return 403 (not
        // 404) with limited-scope keys; a missing object simply 404s from Spaces on the redirect.
        if (config('filesystems.disks.recipe_images.driver') === 's3') {
            return redirect($disk->temporaryUrl($recipe->image_path, now()->addMinutes(30)));
        }

        if (! $disk->exists($recipe->image_path)) {
            abort(404, 'Image not found');
        }

        $file = $disk->get($recipe->image_path);

        $fullPath = $disk->path($recipe->image_path);

        $mimeType = mime_content_type($fullPath);

        return response($file, 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=86400', // Cache for 1 day
        ]);
    }

    public function showAIGenerationModal(
    ): RedirectResponse {
        return to_route('recipes.create')
            ->with([
                'show_recipe_ai_generation_modal' => true,
            ]);
    }

    public function aiGenerationPreview(
        RecipeAIGenerationRequestData $recipeAIGenerationRequestData,
        RecipeAIGenerationAction $recipeAIGenerationAction,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction,
    ): Response|RedirectResponse {
        try {
            Gate::authorize('create', Recipe::class);

            $recipes = $recipeAIGenerationAction->execute($recipeAIGenerationRequestData, true);
            $recipe = $recipes[0] ?? throw new \Exception('No recipe generated from AI response.');

            return Inertia::render(
                'recipe/create',
                [
                    'generated_recipe' => $recipe,
                    'generated_image_data_url' => $recipe->image_data_url,
                    'show_recipe_ai_generation_modal' => false,
                ]
            );
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function aiGeneration(
        RecipeAIGenerationRequestData $recipeAIGenerationRequestData,
        RecipeGenerationSessionState $recipeGenerationSessionState,
        Request $request,
    ): RedirectResponse {
        try {
            Gate::authorize('create', Recipe::class);

            $user = $this->authenticatedUser();
            $requestedCount = (int) ($recipeAIGenerationRequestData->context['count'] ?? 1);
            $requestedCount = max(1, min(10, $requestedCount));

            RecipeAIGenerationJob::dispatch($user->id, $recipeAIGenerationRequestData)
                ->onQueue(RecipeAIGenerationJob::QUEUE);

            $recipeGenerationSessionState->trackQueuedGeneration($request, $user, $requestedCount);

            return back()->with('success', RecipeGenerationQueuedMessage::message());
        } catch (\Exception $e) {
            return back()->with('error', RecipeGenerationFailedMessage::message());
        }
    }

    public function aiImageGeneration(
        RecipeImageAIGenerationRequestData $recipeImageAIGenerationRequestData,
        RecipeImageAIGenerationAction $recipeImageAIGenerationAction
    ): RedirectResponse {
        try {
            Gate::authorize('create', Recipe::class);

            $prompt = $recipeImageAIGenerationRequestData->name.'with'.json_encode($recipeImageAIGenerationRequestData->ingredients);
            $base64Image = $recipeImageAIGenerationAction->execute($prompt);

            return back()->with([
                'generated_image_data_url' => $base64Image,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
