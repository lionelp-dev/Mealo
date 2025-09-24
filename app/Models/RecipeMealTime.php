<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeMealTime extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'meal_time_id',
    ];

    /**
     * @return BelongsTo<Recipe, $this, Pivot>
     */
    public function recipes(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * @return BelongsTo<MealTime, $this, Pivot>
     */
    public function meal_times(): BelongsTo
    {
        return $this->belongsTo(MealTime::class);
    }
}
