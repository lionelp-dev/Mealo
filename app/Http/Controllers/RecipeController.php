<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\MealTimeResource;
use App\Http\Resources\RecipeCollection;
use App\Http\Resources\RecipeResource;
use App\Http\Resources\TagResource;
use App\Models\MealTime;
use App\Models\Recipe;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $recipes = Recipe::query()
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags'])
            ->paginate(15);

        return Inertia::render('recipe/index', [
            'recipes_collection' => new RecipeCollection($recipes)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $tags = Tag::query()->paginate(15);
        return Inertia::render(
            'recipe/create',
            [
                'meal_times' => MealTimeResource::collection(MealTime::all()),
                'tags' => $tags->toResourceCollection()
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRecipeRequest $request): RedirectResponse
    {
        $validated = $request->safe()->only([
            'name',
            'description',
            'preparation_time',
            'cooking_time',
            'meal_times',
            'ingredients',
            'steps',
            'tags'
        ]);

        DB::transaction(function () use ($request, $validated) {
            $recipe = $request->user()->recipes()->create(Arr::except($validated, ['ingredients', 'meal_times', 'steps', 'tags']));
            $recipe->attachIngredients($validated['ingredients']);
            $recipe->attachTags($validated['tags']);
            $recipe->attachMealTimes($validated['meal_times']);
            $recipe->steps()->createMany($validated['steps']);
        });

        return to_route('recipes.index')->with('success', 'Recipe successfully created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe): Response
    {
        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);

        return Inertia::render('recipe/show', [
            'recipe' => new RecipeResource($recipe),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recipe $recipe): Response
    {
        $recipe->load(['mealTimes', 'ingredients', 'steps', 'tags']);
        $tags = Tag::query()->paginate(15);
        return Inertia::render('recipe/edit', [
            'recipe' => new RecipeResource($recipe),
            'meal_times' => MealTimeResource::collection(MealTime::all()),
            'tags' => TagResource::collection($tags)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRecipeRequest $request, Recipe $recipe): RedirectResponse
    {
        $validated = $request->safe()->only([
            'name',
            'description',
            'preparation_time',
            'cooking_time',
            'meal_times',
            'ingredients',
            'steps',
            'tags'
        ]);

        $recipe = Recipe::query()->findOrFail($recipe->id);

        DB::transaction(function () use ($recipe, $validated) {
            $recipe->update(Arr::except($validated, ['ingredients', 'meal_times', 'steps', 'tags']));
            $recipe->syncIngredients($validated['ingredients']);
            $recipe->syncTags($validated['tags']);
            $recipe->syncMealTimes($validated['meal_times']);
            $recipe->syncSteps($validated['steps']);
        });

        return to_route('recipes.show', ['recipe' => $recipe])->with('success', 'Recipe successfully updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Recipe $recipe): RedirectResponse
    {
        $recipe->delete();
        return to_route('recipes.index')->with('success', 'Recipe successfully deleted');
    }
}
