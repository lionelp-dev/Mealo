<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeMealTime extends Pivot
{
    protected $fillable = [
        'recipe_id',
        'meal_time_id',
    ];

    /**
     * @return BelongsTo<Recipe, $this>
     */
    public function recipes(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return BelongsTo<MealTime, $this>
     */
    public function meal_times(): BelongsTo
    {
        return $this->belongsTo(MealTime::class);
    }
}
