<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MealTime extends Model
{
    /**
     * @use HasFactory<\Database\Factories\MealTimeFactory>
     */
    use HasFactory;

    /**
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = MealTime::class;

    protected $fillable = [
        'name',
    ];

    /**
     * @return BelongsToMany<Recipe, $this, RecipeMealTime>
     */
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'recipe_meal_time')
            ->using(RecipeMealTime::class);
    }
}
