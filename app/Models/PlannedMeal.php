<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlannedMeal extends Model
{
    use HasFactory;

    protected $table = 'planned_meals';

    protected $fillable = [
        'user_id',
        'recipe_id',
        'planned_date',
        'meal_time_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function mealTime(): BelongsTo
    {
        return $this->belongsTo(MealTime::class, 'meal_time_id');
    }
}
