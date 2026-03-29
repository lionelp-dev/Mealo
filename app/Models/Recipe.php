<?php

namespace App\Models;

use App\Observers\RecipeObserver;
use App\Policies\RecipePolicy;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
#[UsePolicy(RecipePolicy::class)]
#[ObservedBy([RecipeObserver::class])]
class Recipe extends Model
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;

    use HasUuids;

    protected $table = 'recipes';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'serving_size',
        'preparation_time',
        'cooking_time',
        'image_path',
    ];

    protected $casts = [
        'serving_size' => 'integer',
        'preparation_time' => 'integer',
        'cooking_time' => 'integer',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<MealTime, $this, RecipeMealTime, 'pivot'>
     */
    public function mealTimes(): BelongsToMany
    {
        return $this->belongsToMany(MealTime::class, 'recipe_meal_time')
            ->using(RecipeMealTime::class)
            ->withTimestamps();
    }

    /**
     * @return BelongsToMany<Ingredient, $this, RecipeIngredient, 'pivot'>
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
     * @return BelongsToMany<Tag, $this, RecipeTag, 'pivot'>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'recipe_tag')
            ->using(RecipeTag::class)
            ->withTimestamps();
    }

    /**
     * @return HasMany<PlannedMeal, $this>
     */
    public function plannedMeals(): HasMany
    {
        return $this->hasMany(PlannedMeal::class);
    }

    /**
     * Get secure URL for recipe image
     */
    public function getImageUrl(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        $timestamp = $this->updated_at ? $this->updated_at->timestamp : time();

        return route('recipes.image', ['recipe' => $this->id]).'?v='.$timestamp;
    }
}
