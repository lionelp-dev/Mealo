<?php

namespace App\Models;

use App\Observers\PlannedMealObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $workspace_id
 * @property string $recipe_id
 * @property int $meal_time_id
 * @property \Carbon\Carbon $planned_date
 * @property int $serving_size
 */
#[ObservedBy([PlannedMealObserver::class])]
class PlannedMeal extends Model
{
    /** @use HasFactory<\Database\Factories\PlannedMealFactory> */
    use HasFactory;

    protected $table = 'planned_meals';

    /**
     * @var array<int, string>
     */
    protected $touches = ['workspace'];

    protected $fillable = [
        'user_id',
        'workspace_id',
        'recipe_id',
        'meal_time_id',
        'planned_date',
        'serving_size',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'planned_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Workspace, $this>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * @return BelongsTo<MealTime, $this>
     */
    public function mealTime(): BelongsTo
    {
        return $this->belongsTo(MealTime::class, 'meal_time_id');
    }

    /**
     * @return BelongsTo<Recipe, $this>
     */
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return HasMany<ShoppingListPlannedMealIngredient, $this>
     */
    public function shoppingListIngredients(): HasMany
    {
        return $this->hasMany(ShoppingListPlannedMealIngredient::class);
    }
}
