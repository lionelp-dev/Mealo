<?php

namespace App\Http\Controllers;

use App\Actions\Recipes\DeleteRecipesAction;
use App\Actions\Recipes\FilterRecipesAction;
use App\Actions\Recipes\GenerateRecipeWithAIAction;
use App\Actions\Recipes\SearchIngredientsAction;
use App\Actions\Recipes\SearchTagsAction;
use App\Actions\Recipes\StoreRecipeAction;
use App\Actions\Recipes\UpdateRecipeAction;
use App\Data\Requests\Recipe\DeleteRecipesRequestData;
use App\Data\Requests\Recipe\Entities\MealTimeRequestData;
use App\Data\Requests\Recipe\Entities\TagRequestData;
use App\Data\Requests\Recipe\FilterRecipesRequestData;
use App\Data\Requests\Recipe\GenerateRecipeRequestData;
use App\Data\Requests\Recipe\RecipeFormRequestData;
use App\Data\Requests\Recipe\StoreRecipeRequestData;
use App\Data\Requests\Recipe\UpdateRecipeRequestData;
use App\Data\Resources\Recipe\Entities\IngredientResourceData;
use App\Data\Resources\Recipe\Entities\MealTimeResourceData;
use App\Data\Resources\Recipe\Entities\RecipeResourceData;
use App\Data\Resources\Recipe\Entities\TagResourceData;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(
        Request $request,
        FilterRecipesRequestData $filters,
        FilterRecipesAction $filterRecipes
    ): Response {
        Gate::authorize('viewAny', Recipe::class);

        /** @var User $user */
        $user = $request->user();

        $filteredRecipes = $filterRecipes($user, $filters);

        $tags = Tag::query()->where('user_id', $user->id)->get();

        return Inertia::render('recipe/index', [
            'recipes' => Inertia::scroll(RecipeResourceData::collect($filteredRecipes->paginate(15))),
            'tags' => TagRequestData::collect($tags),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(
        Request $request,
        RecipeFormRequestData $formQuery,
        SearchIngredientsAction $searchIngredients,
        SearchTagsAction $searchTags,
    ): Response {
        Gate::authorize('create', Recipe::class);

        /** @var User $user */
        $user = $request->user();

        $ingredients = $searchIngredients($user, $formQuery->ingredients_search);
        $tags = $searchTags($user, $formQuery->tags_search);

        return Inertia::render(
            'recipe/create',
            [
                'meal_times' => MealTimeResourceData::collect(MealTime::all()),
                'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
                'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
                'show_generate_recipe_with_ai_modal' => $formQuery->show_generate_recipe_with_ai_modal ?? false,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        Request $request,
        StoreRecipeRequestData $recipeData,
        StoreRecipeAction $storeRecipeAction
    ): RedirectResponse {
        Gate::authorize('create', Recipe::class);

        /** @var User $user */
        $user = $request->user();

        $recipe = $storeRecipeAction->execute($user, $recipeData);

        return to_route('recipes.show', ['recipe' => $recipe->id])->with('success', 'Recipe successfully created');
    }

    /**
     * Generate a recipe using AI and return to create form
     */
    public function generateRecipeWithAI(
        Request $request,
        GenerateRecipeRequestData $generateRecipeData,
        GenerateRecipeWithAIAction $generateRecipeWithAIAction,
        SearchIngredientsAction $searchIngredients,
        SearchTagsAction $searchTags,
    ): Response|RedirectResponse {
        Gate::authorize('create', Recipe::class);

        if (! config('services.openai.api_key')) {
            return to_route('recipes.create')->with('error', 'La génération de recettes par IA n\'est pas disponible.');
        }

        try {
            $recipe = $generateRecipeWithAIAction->execute($generateRecipeData);

            /** @var User $user */
            $user = $request->user();

            $ingredients = $searchIngredients($user, null);
            $tags = $searchTags($user, null);

            return Inertia::render(
                'recipe/create',
                [
                    'meal_times' => MealTimeRequestData::collect(MealTime::all()),
                    'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
                    'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
                    'should_open_ai_modal' => false,
                    'generated_recipe' => $recipe,
                ]
            );
        } catch (\Exception $e) {
            return to_route('recipes.create')->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        Gate::authorize('view', $recipe);

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        return Inertia::render('recipe/show', [
            'recipe' => RecipeResourceData::from($recipe)->include('ingredients'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        Request $request,
        Recipe $recipe,
        RecipeFormRequestData $formQuery,
        SearchIngredientsAction $searchIngredients,
        SearchTagsAction $searchTags,
    ): Response {
        Gate::authorize('update', $recipe);

        /** @var User $user */
        $user = $request->user();

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        $ingredients = $searchIngredients($user, $formQuery->ingredients_search);
        $tags = $searchTags($user, $formQuery->tags_search);

        return Inertia::render('recipe/edit', [
            'meal_times' => MealTimeRequestData::collect(MealTime::all()),
            'recipe' => RecipeResourceData::from($recipe)->include('ingredients'),
            'ingredients_search_results' => Inertia::scroll(IngredientResourceData::collect($ingredients->paginate(5, pageName: 'ingredients_page'))),
            'tags_search_results' => Inertia::scroll(TagResourceData::collect($tags->paginate(5, pageName: 'tags_page'))),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Recipe $recipe,
        UpdateRecipeRequestData $recipeData,
        UpdateRecipeAction $updateRecipeAction
    ): RedirectResponse {
        Gate::authorize('update', $recipe);

        /** @var User $user */
        $user = $request->user();

        $updateRecipeAction->execute(
            $recipe,
            $recipeData,
        );

        return to_route('recipes.show', ['recipe' => $recipe])->with('success', 'Recipe successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Request $request,
        DeleteRecipesRequestData $data,
        DeleteRecipesAction $action
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        $action->execute($user, $data);

        return to_route('recipes.index')->with('success', 'Recipe successfully deleted');
    }

    /**
     * Serve recipe image
     */
    public function image(
        Request $request,
        Recipe $recipe
    ): HttpResponse {
        /* @var User $user */
        $user = $request->user();

        if ($user && ($recipe->user_id !== $user->id)) {
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
