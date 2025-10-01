<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;

class Recipe extends Model
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;

    protected $table = 'recipes';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'preparation_time',
        'cooking_time',
    ];

    /**
     * @param array<Ingredient> $ingredients_data
     */
    public function syncIngredients($ingredients_data): void
    {
        $pivotData = collect($ingredients_data)->mapWithKeys(function ($ingredient_data) {
            $ingredient = Ingredient::query()->firstOrCreate(['name' => $ingredient_data['name']]);
            return [$ingredient->id => Arr::only($ingredient_data, ['quantity', 'unit'])];
        });

        $this->ingredients()->sync($pivotData->toArray());
    }

    /**
     * @param array<Tag> $tags_data
     */
    public function syncTags($tags_data): void
    {
        $tags = collect($tags_data)->map(function ($tag_data) {
            $tag = Tag::query()->firstOrCreate(['name' => $tag_data['name']]);
            return $tag->id;
        });

        $this->tags()->sync($tags->toArray());
    }

    /**
     * @param array<MealTime> $meal_times_data
     */
    public function syncMealTimes($meal_times_data): void
    {

        $meal_times_ids = collect($meal_times_data)->map(function ($meal_time_data) {
            $meal_time = MealTime::query()->where('name', $meal_time_data['name'])->first();
            return $meal_time->id;
        })->toArray();

        $this->mealTimes()->sync($meal_times_ids);
    }

    /**
     * @param array<Ingredient> $ingredients_data
     */
    public function attachIngredients($ingredients_data): void
    {
        $this->syncIngredients($ingredients_data);
    }

    /**
     * @param array<Tag> $tags_data
     */
    public function attachTags($tags_data): void
    {
        $this->syncTags($tags_data);
    }

    /**
     * @param array<MealTime> $meal_times_data
     */
    public function attachMealTimes($meal_times_data): void
    {
        $this->syncMealTimes($meal_times_data);
    }

    /**
     * @param array<Step> $steps_data
     */
    public function syncSteps($steps_data): void
    {
        $this->steps()->delete();
        $this->steps()->createMany($steps_data);
    }

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
