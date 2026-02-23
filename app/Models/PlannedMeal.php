<?php

namespace App\Models;

use App\Observers\PlannedMealObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy([PlannedMealObserver::class])]
class PlannedMeal extends Model
{
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
     * @return BelongsTo<User,PlannedMeal>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Workspace,PlannedMeal>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * @return BelongsTo<MealTime,PlannedMeal>
     */
    public function mealTime(): BelongsTo
    {
        return $this->belongsTo(MealTime::class, 'meal_time_id');
    }

    /**
     * @return BelongsTo<Recipe,PlannedMeal>
     */
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return HasMany<ShoppingListPlannedMealIngredient,PlannedMeal>
     */
    public function shoppingListIngredients(): HasMany
    {
        return $this->hasMany(ShoppingListPlannedMealIngredient::class);
    }
}
