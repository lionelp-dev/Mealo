<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;

    protected $table = 'recipe';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'preparation_time',
        'cooking_time',
    ];

    /**
     * @return BelongsTo<User>
     */
    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    /**
     * @return BelongsToMany<Recipe>
     */
    public function mealTimes(): BelongsToMany
    {
        return $this->belongsToMany(MealTime::class, 'recipe_meal_time')
            ->using(RecipeMealTime::class)
            ->withTimestamps();
    }

    /**
     * @return BelongsToMany<Ingredient, $this>
     */
    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
            ->using(RecipeIngredient::class)
            ->withPivot(['quantity', 'unit'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Step, $this >
     */
    public function steps(): HasMany
    {
        return $this->hasMany(Step::class);
    }

    /**
     * @return BelongsToMany<Recipe>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'recipe_tag')
            ->using(RecipeTag::class)
            ->withTimestamps();
    }
}
