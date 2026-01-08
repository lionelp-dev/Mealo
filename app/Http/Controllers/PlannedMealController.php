<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlannedMeal;
use App\Http\Requests\UpdatePlannedMeal;
use App\Http\Resources\PlannedMealResource;
use App\Http\Resources\RecipeCollection;
use App\Http\Resources\TagResource;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\Tag;
use App\Services\ShoppingListService;
use App\Services\AIMealPlanningService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PlannedMealController extends Controller
{
    public function __construct(
        private ShoppingListService $shoppingListService,
        private AIMealPlanningService $aiMealPlanningService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'week' => ['nullable', 'date'],
            'search' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'meal_times' => ['nullable', 'array'],
            'meal_times.*' => ['integer', 'exists:meal_times,id'],
            'preparation_time' => ['nullable', 'string', 'in:[0..15],[15..30],[30..60],>60'],
            'cooking_time' => ['nullable', 'string', 'in:[0..15],[15..30],[30..60],>60'],
        ]);

        $weekStart = ($validated['week'] ?? null)
            ? Carbon::parse($validated['week'])->startOf('week')
            : Carbon::now()->startOf('week');

        $weekEnd = $weekStart->copy()->endOf('week');

        $plannedMeals = PlannedMeal::query()->where('user_id', $user->id)->with('recipe:id,name,image_path')
            ->whereBetween('planned_date', [
                $weekStart->toDateString(),
                $weekEnd->toDateString(),
            ])
            ->get();

        $mealTimes = MealTime::all();

        $recipesQuery = Recipe::query()
            ->where('user_id', $user->id)
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);

        // Search filter
        if (!empty($validated['search'])) {
            $recipesQuery = $recipesQuery->where('name', 'LIKE', '%' . $validated['search'] . '%');
        }

        // Preparation time filter
        if (!empty($validated['preparation_time'])) {
            $recipesQuery = $this->applyTimeFilter($recipesQuery, 'preparation_time', $validated['preparation_time']);
        }

        // Cooking time filter
        if (!empty($validated['cooking_time'])) {
            $recipesQuery = $this->applyTimeFilter($recipesQuery, 'cooking_time', $validated['cooking_time']);
        }

        // Tags filter (AND logic - recipe must have ALL selected tags)
        if (!empty($validated['tags']) && count($validated['tags']) > 0) {
            foreach ($validated['tags'] as $tagId) {
                $recipesQuery = $recipesQuery->whereHas('tags', function ($query) use ($tagId) {
                    $query->where('tags.id', $tagId);
                });
            }
        }

        // Meal times filter
        if (!empty($validated['meal_times']) && count($validated['meal_times']) > 0) {
            $recipesQuery = $recipesQuery->whereHas('mealTimes', function ($query) use ($validated) {
                $query->whereIn('meal_times.id', $validated['meal_times']);
            });
        }

        return Inertia::render('planned-meals/index', [
            'weekStart' => $weekStart->toISOString(),
            'mealTimes' => $mealTimes,
            'plannedMeals' => PlannedMealResource::collection($plannedMeals)->toArray($request),
            'tags' => TagResource::collection(Tag::query()->where('user_id', $user->id)->get())->toArray($request),
            'recipes' => Inertia::scroll(fn() => new RecipeCollection($recipesQuery->paginate(10))),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Display the specified resource.
     */
    public function show(PlannedMeal $plannedMeal)
    {
        Gate::authorize('view', $plannedMeal);

        return response()->json($plannedMeal->load('recipe'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PlannedMeal $plannedMeal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlannedMeal $request, PlannedMeal $plannedMeal)
    {
        return DB::transaction(function () use ($request, $plannedMeal) {
            Gate::authorize('update', $plannedMeal);

            $originalDate = $plannedMeal->planned_date;

            $validated = $request->safe()->only([
                'recipe_id',
                'meal_time_id',
                'planned_date',
            ]);

            $recipe = Recipe::findOrFail($validated['recipe_id']);
            Gate::authorize('create', [PlannedMeal::class, $recipe]);

            $plannedMeal->update($validated);

            // Regenerate shopping lists for both original and new weeks (if different)
            $affectedDates = [$originalDate, $plannedMeal->planned_date];
            $this->shoppingListService->regenerateAffectedShoppingLists(
                $request->user()->id,
                $affectedDates
            );

            return to_route('planned-meals.index')->with('success', 'Planned meal successfully updated');
        }, attempts: 5);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'planned_meals' => ['required', 'array'],
                'planned_meals.*.recipe_id' => ['required', 'integer', 'exists:recipes,id'],
                'planned_meals.*.meal_time_id' => ['required', 'integer', 'exists:meal_times,id'],
                'planned_meals.*.planned_date' => ['required', 'date'],
            ]);

            $plannedMealsInput = $validated['planned_meals'];

            $plannedMealsData = [];
            $affectedDates = [];

            foreach ($plannedMealsInput as $plannedMealData) {
                $recipe = Recipe::findOrFail($plannedMealData['recipe_id']);
                Gate::authorize('create', [PlannedMeal::class, $recipe]);

                $plannedMealsData[] = [
                    'user_id' => $request->user()->id,
                    'recipe_id' => $plannedMealData['recipe_id'],
                    'meal_time_id' => $plannedMealData['meal_time_id'],
                    'planned_date' => $plannedMealData['planned_date'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $affectedDates[] = $plannedMealData['planned_date'];
            }

            PlannedMeal::insert($plannedMealsData);

            // Regenerate shopping lists for all affected weeks
            $this->shoppingListService->regenerateAffectedShoppingLists(
                $request->user()->id,
                $affectedDates
            );

            $successMessage = count($plannedMealsInput) > 1 ? 'Meals successfully planned' : 'Meal successfully planned';
            return to_route('planned-meals.index')->with('success', $successMessage);
        }, attempts: 5);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'planned_meals' => ['required', 'array'],
                'planned_meals.*' => ['integer', 'exists:planned_meals,id'],
            ]);

            $plannedMealIds = $validated['planned_meals'];

            $plannedMeals = PlannedMeal::whereIn('id', $plannedMealIds)
                ->where('user_id', $request->user()->id)
                ->get();

            // If not all requested meals were found, some don't belong to user
            if ($plannedMeals->count() !== count($plannedMealIds)) {
                abort(403, 'Some planned meals do not belong to you');
            }

            foreach ($plannedMeals as $plannedMeal) {
                Gate::authorize('delete', $plannedMeal);
            }

            // Collect affected dates before deletion
            $affectedDates = $plannedMeals->pluck('planned_date')->toArray();

            PlannedMeal::whereIn('id', $plannedMeals->pluck('id'))->delete();

            // Regenerate shopping lists for all affected weeks
            $this->shoppingListService->regenerateAffectedShoppingLists(
                $request->user()->id,
                $affectedDates
            );

            $successMessage = $plannedMeals->count() > 1 ? 'Planned meals successfully deleted' : 'Planned meal successfully deleted';
            return to_route('planned-meals.index')->with('success', $successMessage);
        }, attempts: 5);
    }

    /**
     * Generate a meal plan using AI
     */
    public function generatePlan(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'startDate' => ['required', 'date'],
            'days' => ['nullable', 'integer', 'min:1', 'max:7'],
        ]);

        $startDate = Carbon::parse($validated['startDate']);
        $days = $validated['days'] ?? 7;

        try {
            // Generate meal plan using AI
            $plannedMeals = $this->aiMealPlanningService->generateMealPlan([
                'userId' => $user->id,
                'days' => $days,
                'startDate' => $startDate,
            ]);

            // Save the generated meal plans to database
            $createdMeals = [];
            $affectedDates = [];
            foreach ($plannedMeals as $mealData) {
                $createdMeals[] = PlannedMeal::create([
                    'user_id' => $user->id,
                    'recipe_id' => $mealData['recipe_id'],
                    'planned_date' => $mealData['planned_date'],
                    'meal_time_id' => $mealData['meal_time_id'],
                ]);
                $affectedDates[] = $mealData['planned_date'];
            }

            // Regenerate shopping lists for all affected weeks
            $this->shoppingListService->regenerateAffectedShoppingLists(
                $user->id,
                $affectedDates
            );

            return redirect()->back()->with(
                'success',
                'Planning généré avec succès ! ' . count($createdMeals) . ' repas créés.'
            );

        } catch (\Exception $e) {
            return redirect()->back()->with(
                'error',
                'Erreur lors de la génération du planning : ' . $e->getMessage()
            );
        }
    }

    /**
     * Apply time-based filters to recipe query.
     */
    private function applyTimeFilter($query, $field, $timeRange)
    {
        switch ($timeRange) {
            case '[0..15]':
                return $query->where($field, '<=', 15);
            case '[15..30]':
                return $query->whereBetween($field, [16, 30]);
            case '[30..60]':
                return $query->whereBetween($field, [31, 60]);
            case '>60':
                return $query->where($field, '>', 60);
            default:
                return $query;
        }
    }
}
