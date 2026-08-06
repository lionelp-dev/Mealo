<?php

namespace App\Http\Controllers;

use App\Actions\PlannedMeal\PlannedMealDestroyAction;
use App\Actions\PlannedMeal\PlannedMealGeneratePlanAction;
use App\Actions\PlannedMeal\PlannedMealStoreAction;
use App\Actions\PlannedMeal\PlannedMealUpdateAction;
use App\Actions\PlannedMeal\PlannedMealWeekQueryAction;
use App\Actions\Recipes\RecipeFiltersAction;
use App\Actions\Recipes\RecipeSearchAction;
use App\Actions\Workspace\WorkspaceGetCurrentAction;
use App\Data\Requests\PlannedMeal\PlannedMealDestroyRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealGeneratePlanRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealIndexRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealStoreRequestData;
use App\Data\Requests\PlannedMeal\PlannedMealUpdateRequestData;
use App\Data\Requests\Recipe\RecipeFiltersRequestData;
use App\Data\Requests\Recipe\RecipeSearchRequestData;
use App\Data\Resources\PlannedMeal\PlannedMealResourceData;
use App\Data\Resources\Recipe\Entities\TagResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceInvitationResourceData;
use App\Data\Resources\Workspace\Entities\WorkspaceResourceData;
use App\Http\Controllers\Concerns\HasAuthenticatedUser;
use App\Http\Resources\RecipeCollection;
use App\Messages\PlannedMeal\MealPlanGeneratedMessage;
use App\Messages\PlannedMeal\PlannedMealStoredMessage;
use App\Messages\PlannedMeal\PlannedMealsUnplannedMessage;
use App\Messages\PlannedMeal\PlannedMealUnplannedMessage;
use App\Messages\PlannedMeal\PlannedMealUpdatedMessage;
use App\Models\MealTime;
use App\Models\PlannedMeal;
use App\Models\Recipe;
use App\Models\Tag;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PlannedMealController extends Controller
{
    use HasAuthenticatedUser;

    public function index(
        PlannedMealIndexRequestData $plannedMealIndexRequestData,
        WorkspaceGetCurrentAction $workspaceGetCurrentAction,
        PlannedMealWeekQueryAction $plannedMealWeekQueryAction,
        RecipeFiltersRequestData $recipeFiltersRequestData,
        RecipeFiltersAction $recipeFiltersAction,
        RecipeSearchRequestData $recipeSearchRequestData,
        RecipeSearchAction $recipeSearchAction
    ): Response {
        $currentWorkspace = $workspaceGetCurrentAction($this->authenticatedUser());

        $plannedMeals = $plannedMealWeekQueryAction($currentWorkspace, $plannedMealIndexRequestData->week);

        $recipeQuery = Recipe::query()
            ->where('user_id', $this->authenticatedUser()->id)
            ->orderBy('created_at', 'desc')
            ->with(['mealTimes', 'ingredients', 'steps', 'tags']);

        $recipeQuery = $recipeFiltersAction($this->authenticatedUser(), $recipeQuery, $recipeFiltersRequestData);
        $recipeQuery = $recipeSearchAction($this->authenticatedUser(), $recipeQuery, $recipeSearchRequestData);

        $tags = Tag::query()->where('user_id', $this->authenticatedUser()->id)->get();

        $weekStart = $plannedMealIndexRequestData->week
            ? Carbon::parse($plannedMealIndexRequestData->week)->startOf('week')
            : Carbon::now()->startOf('week');

        $plannedMealImages = [];
        foreach ($plannedMeals as $plannedMeal) {
            $recipe = $plannedMeal->recipe;
            if ($recipe === null || ! $recipe->image_path) {
                continue;
            }

            $plannedMealImages[$recipe->id] = $recipe->getImageUrl();
        }

        return Inertia::render('meal-planning/index', [
            'weekStart' => $weekStart->toISOString(),
            'mealTimes' => MealTime::all(),
            'plannedMeals' => PlannedMealResourceData::collect($plannedMeals),
            'plannedMealImages' => $plannedMealImages,
            'recipes' => Inertia::scroll(fn () => new RecipeCollection($recipeQuery->paginate(10))),
            'tags' => TagResourceData::collect($tags),
            'workspace_data' => [
                'current_workspace' => WorkspaceResourceData::from($currentWorkspace),
                'workspaces' => WorkspaceResourceData::collect($this->authenticatedUser()->workspaces),
                'pending_invitations' => WorkspaceInvitationResourceData::collect($this->authenticatedUser()->workspacesInvitations()
                    ->where('expires_at', '>', now())
                    ->with(['workspace', 'invitedBy'])
                    ->get()),
            ],
        ]);
    }

    public function store(
        PlannedMealStoreRequestData $plannedMealStoreRequest,
        WorkspaceGetCurrentAction $workspaceGetCurrentAction,
        PlannedMealStoreAction $plannedMealStoreAction,
    ): RedirectResponse {
        try {
            $currentWorkspace = $workspaceGetCurrentAction($this->authenticatedUser());

            $plannedMealStoreAction->execute($this->authenticatedUser(), $currentWorkspace, $plannedMealStoreRequest);

            return back()->with('success', PlannedMealStoredMessage::message());
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function update(
        PlannedMealUpdateRequestData $plannedMealUpdateRequestData,
        PlannedMeal $plannedMeal,
        PlannedMealUpdateAction $plannedMealUpdateAction,
    ): RedirectResponse {
        try {
            Gate::authorize('update', $plannedMeal);

            $plannedMealUpdateAction->execute(
                $this->authenticatedUser(),
                $plannedMeal,
                $plannedMealUpdateRequestData
            );

            return back()->with('success', PlannedMealUpdatedMessage::message());
        } catch (AuthorizationException $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroy(
        PlannedMealDestroyRequestData $plannedMealDestroyRequestData,
        PlannedMealDestroyAction $plannedMealDestroyAction,
        WorkspaceGetCurrentAction $workspaceGetCurrentAction,
    ): RedirectResponse {
        try {
            $currentWorkspace = $workspaceGetCurrentAction($this->authenticatedUser());

            $deletedCount = $plannedMealDestroyAction->execute($this->authenticatedUser(), $currentWorkspace, $plannedMealDestroyRequestData);

            $successMessage = $deletedCount > 1
                ? PlannedMealsUnplannedMessage::message()
                : PlannedMealUnplannedMessage::message();

            return back()->with('success', $successMessage);
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function generatePlan(
        WorkspaceGetCurrentAction $workspaceGetCurrentAction,
        PlannedMealGeneratePlanRequestData $plannedMealPlanGenerationRequestData,
        PlannedMealGeneratePlanAction $plannedMealGeneratePlanAction,
    ): RedirectResponse {
        try {
            $currentWorkspace = $workspaceGetCurrentAction($this->authenticatedUser());

            Gate::authorize('editPlanning', $currentWorkspace);

            $createdCount = $plannedMealGeneratePlanAction->execute(
                $this->authenticatedUser(),
                $currentWorkspace,
                $plannedMealPlanGenerationRequestData,
            );

            return redirect()->back()->with(
                'success',
                MealPlanGeneratedMessage::forCreatedCount($createdCount)
            );
        } catch (
            Exception
            |AuthorizationException $e
        ) {
            return redirect()->back()->with(
                'error',
                $e->getMessage()
            );
        }
    }
}
