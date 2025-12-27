<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\IngredientCollection;
use App\Http\Resources\MealTimeResource;
use App\Http\Resources\RecipeCollection;
use App\Http\Resources\RecipeResource;
use App\Http\Resources\TagCollection;
use App\Models\Ingredient;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\Tag;
use App\Models\User;
use App\Services\AIRecipeGenerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    public function __construct(
        private AIRecipeGenerationService $aiRecipeGenerationService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Recipe::class);

        /** @var User $user */
        $user = $request->user();

        $recipes = $user->recipes()
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags'])
            ->paginate(15);

        return Inertia::render('recipe/index', [
            'recipes_collection' => Inertia::scroll(new RecipeCollection($recipes)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Recipe::class);

        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'ingredients_search' => ['nullable', 'string', 'max:255'],
            'tags_search' => ['nullable', 'string', 'max:255'],
            'generate' => ['nullable', 'boolean'],
        ]);

        $ingredientsQuery = Ingredient::query()->where('user_id', $user->id);
        if (!empty($validated['ingredients_search'])) {
            $ingredientsQuery = $ingredientsQuery
            ->where('name', 'like', '%' . $validated['ingredients_search'] . '%')
            ->orderBy('name');
        }

        $tagsQuery = Tag::query()->where('user_id', $user->id);
        if (!empty($validated['tags_search'])) {
            $tagsQuery = $tagsQuery
            ->where('name', 'like', '%' . $validated['tags_search'] . '%')
            ->orderBy('name');
        }

        return Inertia::render(
            'recipe/create',
            [
                'meal_times' => MealTimeResource::collection(MealTime::all()),
                'ingredients_search_results' => Inertia::scroll(new IngredientCollection($ingredientsQuery->paginate(5))),
                'tags_search_results' => Inertia::scroll(new TagCollection($tagsQuery->paginate(5))),
                'should_open_ai_modal' => $validated['generate'] ?? false,
            ]
        );
    }

    /**
     * Generate a recipe using AI and return to create form
     */
    public function generateRecipeWithAI(Request $request): Response|RedirectResponse
    {
        Gate::authorize('create', Recipe::class);

        $request->validate([
            'prompt' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        try {
            $recipe = $this->aiRecipeGenerationService->generateRecipe($request->input('prompt'));

            /** @var User $user */
            $user = $request->user();
            $ingredientsQuery = Ingredient::query()->where('user_id', $user->id);
            $tagsQuery = Tag::query()->where('user_id', $user->id);

            return Inertia::render(
                'recipe/create',
                [
                    'meal_times' => MealTimeResource::collection(MealTime::all()),
                    'ingredients_search_results' => Inertia::scroll(new IngredientCollection($ingredientsQuery->paginate(5))),
                    'tags_search_results' => Inertia::scroll(new TagCollection($tagsQuery->paginate(5))),
                    'should_open_ai_modal' => false,
                    'generated_recipe' => $recipe,
                ]
            );

        } catch (\Exception $e) {
            return to_route('recipes.create')->with('error', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request): RedirectResponse
    {
        Gate::authorize('create', Recipe::class);

        $validated = $request->safe()->only([
            'name',
            'description',
            'preparation_time',
            'cooking_time',
            'meal_times',
            'ingredients',
            'steps',
            'tags',
        ]);

        /** @var User $user */
        $user = $request->user();

        $recipe = null;
        DB::transaction(function () use ($user, $validated, &$recipe) {
            $recipe = $user->recipes()->create(Arr::except($validated, ['ingredients', 'meal_times', 'steps', 'tags']));
            $recipe->attachIngredients($validated['ingredients']);
            $recipe->attachTags($validated['tags']);
            $recipe->attachMealTimes($validated['meal_times']);
            $recipe->steps()->createMany($validated['steps']);
        });

        // Upload image after transaction to avoid update visibility issues
        if ($recipe && $request->hasFile('image')) {
            $recipe->uploadImage($request->file('image'));
        }

        return to_route('recipes.index')->with('success', 'Recipe successfully created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        Gate::authorize('view', $recipe);

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        return Inertia::render('recipe/show', [
            'recipe' => new RecipeResource($recipe),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Recipe $recipe): Response
    {
        Gate::authorize('update', $recipe);

        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'ingredients_search' => ['nullable', 'string', 'max:255'],
            'tags_search' => ['nullable', 'string', 'max:255'],
        ]);

        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        $ingredientsQuery = Ingredient::query()->where('user_id', $user->id);
        if (!empty($validated['ingredients_search'])) {
            $ingredientsQuery = $ingredientsQuery
            ->where('name', 'like', '%' . $validated['ingredients_search'] . '%')
            ->orderBy('name');
        }

        $tagsQuery = Tag::query()->where('user_id', $user->id);
        if (!empty($validated['tags_search'])) {
            $tagsQuery = $tagsQuery
            ->where('name', 'like', '%' . $validated['tags_search'] . '%')
            ->orderBy('name');
        }

        return Inertia::render('recipe/edit', [
            'recipe' => new RecipeResource($recipe),
            'meal_times' => MealTimeResource::collection(MealTime::all()),
            'ingredients_search_results' => Inertia::scroll(new IngredientCollection($ingredientsQuery->paginate(5))),
            'tags_search_results' => Inertia::scroll(new TagCollection($tagsQuery->paginate(5))),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, Recipe $recipe): RedirectResponse
    {
        Gate::authorize('update', $recipe);

        $validated = $request->safe()->only([
            'name',
            'description',
            'preparation_time',
            'cooking_time',
            'meal_times',
            'ingredients',
            'steps',
            'tags',
        ]);


        DB::transaction(function () use ($recipe, $validated) {
            $recipe->update(Arr::except($validated, ['ingredients', 'meal_times', 'steps', 'tags']));
            $recipe->syncIngredients($validated['ingredients']);
            $recipe->syncTags($validated['tags']);
            $recipe->syncMealTimes($validated['meal_times']);
            $recipe->syncSteps($validated['steps']);
        });

        // Handle image after transaction to avoid update visibility issues
        if ($request->hasFile('image')) {
            $recipe->uploadImage($request->file('image'));
        } elseif ($request->has('image') && $request->input('image') === null) {
            // Image was explicitly set to null (removed)
            $recipe->deleteImage();
        }

        return to_route('recipes.show', ['recipe' => $recipe])->with('success', 'Recipe successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Recipe $recipe): RedirectResponse
    {
        Gate::authorize('delete', $recipe);

        $recipe->delete();
        return to_route('recipes.index')->with('success', 'Recipe successfully deleted');
    }

    /**
     * Upload image for a recipe
     */
    public function uploadImage(Request $request, Recipe $recipe): JsonResponse
    {
        Gate::authorize('update', $recipe);

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:5120'],
        ]);

        $recipe->uploadImage($request->file('image'));

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image_url' => $recipe->getImageUrl(),
        ]);
    }

    /**
     * Serve recipe image
     */
    public function image(Request $request, Recipe $recipe): HttpResponse
    {
        // Vérifier que l'utilisateur connecté est bien le propriétaire de la recette
        if ($request->user()->id !== $recipe->user_id) {
            abort(403, 'Unauthorized access to this recipe image');
        }

        if (!$recipe->image_path) {
            abort(404, 'Image not found');
        }

        if (!Storage::disk('recipe_images')->exists($recipe->image_path)) {
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
