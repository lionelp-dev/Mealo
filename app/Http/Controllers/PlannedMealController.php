<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlannedMealRequest;
use App\Http\Requests\UpdatePlannedMealRequest;
use App\Http\Resources\PlannedMealResource;
use App\Http\Resources\RecipeCollection;
use App\Http\Resources\TagResource;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\Tag;
use App\Services\AIMealPlanningService;
use App\Services\WorkspaceDataService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PlannedMealController extends Controller
{
    public function __construct(
        private AIMealPlanningService $aiMealPlanningService,
        private WorkspaceDataService $workspaceDataService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
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

        // Get workspace data for frontend
        $workspaceData = $this->workspaceDataService->getWorkspaceDataForUser($user);
        $currentWorkspace = $workspaceData['current_workspace'];

        // Get planned meals for current workspace
        $plannedMeals = PlannedMeal::query()
            ->where('workspace_id', $currentWorkspace->id)
            ->with(['recipe:id,name,image_path', 'user:id,name'])
            ->whereBetween('planned_date', [
                $weekStart,
                $weekEnd,
            ])
            ->get();

        $mealTimes = MealTime::all();

        $recipesQuery = Recipe::query()
            ->where('user_id', $user->id)
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);

        // Search filter
        if (! empty($validated['search'])) {
            $recipesQuery = $recipesQuery->where('name', 'LIKE', '%'.$validated['search'].'%');
        }

        // Preparation time filter
        if (! empty($validated['preparation_time'])) {
            $recipesQuery = $this->applyTimeFilter($recipesQuery, 'preparation_time', $validated['preparation_time']);
        }

        // Cooking time filter
        if (! empty($validated['cooking_time'])) {
            $recipesQuery = $this->applyTimeFilter($recipesQuery, 'cooking_time', $validated['cooking_time']);
        }

        // Tags filter (AND logic - recipe must have ALL selected tags)
        if (! empty($validated['tags']) && count($validated['tags']) > 0) {
            foreach ($validated['tags'] as $tagId) {
                $recipesQuery = $recipesQuery->whereHas('tags', function ($query) use ($tagId) {
                    $query->where('tags.id', $tagId);
                });
            }
        }

        // Meal times filter
        if (! empty($validated['meal_times']) && count($validated['meal_times']) > 0) {
            $recipesQuery = $recipesQuery->whereHas('mealTimes', function ($query) use ($validated) {
                $query->whereIn('meal_times.id', $validated['meal_times']);
            });
        }

        return Inertia::render('planned-meals/index', [
            'weekStart' => $weekStart->toISOString(),
            'mealTimes' => $mealTimes,
            'plannedMeals' => PlannedMealResource::collection($plannedMeals)->toArray($request),
            'tags' => TagResource::collection(Tag::query()->where('user_id', $user->id)->get())->toArray($request),
            'recipes' => Inertia::scroll(fn () => new RecipeCollection($recipesQuery->paginate(10))),
            'workspace_data' => $workspaceData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PlannedMeal $plannedMeal): JsonResponse
    {
        Gate::authorize('view', $plannedMeal);

        return response()->json($plannedMeal->load('recipe'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PlannedMeal $plannedMeal): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlannedMealRequest $request, PlannedMeal $plannedMeal): mixed
    {
        return DB::transaction(function () use ($request, $plannedMeal) {
            Gate::authorize('update', $plannedMeal);

            $originalDate = $plannedMeal->planned_date;

            $validated = $request->safe()->only([
                'recipe_id',
                'meal_time_id',
                'planned_date',
                'serving_size',
            ]);

            $recipe = Recipe::findOrFail($validated['recipe_id']);
            Gate::authorize('create', [PlannedMeal::class, $recipe]);

            $plannedMeal->update($validated);

            // Regenerate shopping lists for both original and new weeks (if different)
            $affectedDates = [$originalDate, $plannedMeal->planned_date];

            return to_route('planned-meals.index')->with('success', 'Planned meal successfully updated');
        }, attempts: 5);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlannedMealRequest $request): mixed
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $user = $request->user();

            $currentWorkspace = $this->workspaceDataService->getCurrentWorkspace($user);

            try {
                Gate::authorize('editPlanning', $currentWorkspace);

                try {
                    foreach ($validated['planned_meals'] as $plannedMealData) {
                        $parsedDate = Carbon::parse($plannedMealData['planned_date'])->format('Y-m-d');

                        $plannedMeal = PlannedMeal::query()
                            ->where('user_id', $user->id)
                            ->where('workspace_id', $currentWorkspace->id)
                            ->where('recipe_id', $plannedMealData['recipe_id'])
                            ->where('meal_time_id', $plannedMealData['meal_time_id'])
                            ->whereDate('planned_date', $parsedDate)
                            ->first();

                        if ($plannedMeal) {
                            $plannedMeal->serving_size += $plannedMealData['serving_size'];
                            $plannedMeal->save();
                        } else {
                            PlannedMeal::create([
                                'user_id' => $user->id,
                                'workspace_id' => $currentWorkspace->id,
                                'recipe_id' => $plannedMealData['recipe_id'],
                                'meal_time_id' => $plannedMealData['meal_time_id'],
                                'planned_date' => $plannedMealData['planned_date'],
                                'serving_size' => $plannedMealData['serving_size'],
                            ]);
                        }
                    }

                    return back()->with('success', 'Meal successfully planned');
                } catch (Exception $e) {
                    return back()->with('error', 'Meal doesnt successfully planned: ');
                }
            } catch (Exception $e) {
                return back()->with('error', 'This action is unauthorized');
            }
        }, attempts: 5);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): mixed
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validate([
                'planned_meals' => ['required', 'array'],
                'planned_meals.*' => ['integer', 'exists:planned_meals,id'],
            ]);

            $plannedMealIds = $validated['planned_meals'];

            // Get current workspace and check permission
            $currentWorkspace = $this->workspaceDataService->getCurrentWorkspace($request->user());

            // Fetch planned meals from current workspace
            $plannedMeals = PlannedMeal::query()->whereIn('id', $plannedMealIds)
                ->where('workspace_id', $currentWorkspace->id)
                ->get();

            // Verify all requested meals were found in the current workspace
            if ($plannedMeals->count() !== count($plannedMealIds)) {
                abort(403, 'Some planned meals are not accessible in this workspace');
            }

            try {
                foreach ($plannedMeals as $plannedMeal) {
                    Gate::authorize('delete', $plannedMeal);
                }
            } catch (Exception $e) {
                return back()->with('error', 'This action is unauthorized');
            }

            // Collect affected dates before deletion
            $affectedDates = $plannedMeals->pluck('planned_date')->toArray();

            foreach ($plannedMeals as $plannedMeal) {
                $plannedMeal->delete();
            }

            $successMessage = $plannedMeals->count() > 1 ? 'Planned meals successfully deleted' : 'Planned meal successfully deleted';

            return back()->with('success', $successMessage);
        }, attempts: 5);
    }

    /**
     * Generate a meal plan using AI
     */
    public function generatePlan(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! config('services.openai.api_key')) {
            return back()->with('error', 'La génération de planning par IA n\'est pas disponible.');
        }

        $validated = $request->validate([
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date'],
            'serving_size' => ['required', 'integer', 'min:1', 'max:255'],
        ]);

        $startDate = Carbon::parse($validated['startDate']);
        $endDate = Carbon::parse($validated['endDate']);

        // Get current workspace
        $currentWorkspace = $this->workspaceDataService->getCurrentWorkspace($user);

        try {
            Gate::authorize('editPlanning', $currentWorkspace);
        } catch (Exception $e) {
            return back()->with('error', 'This action is unauthorized');
        }

        try {
            // Generate meal plan using AI
            $plannedMeals = $this->aiMealPlanningService->generateMealPlan([
                'userId' => $user->id,
                'workspaceId' => $currentWorkspace->id,
                'startDate' => $startDate,
                'endDate' => $endDate,
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
                    'workspace_id' => $currentWorkspace->id,
                    'serving_size' => $validated['serving_size'],
                ]);
                $affectedDates[] = $mealData['planned_date'];
            }

            return redirect()->back()->with(
                'success',
                'Planning généré avec succès ! '.count($createdMeals).' repas créés.'
            );
        } catch (\Exception $e) {
            return redirect()->back()->with(
                'error',
                'Erreur lors de la génération du planning : '.$e->getMessage()
            );
        }
    }

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
