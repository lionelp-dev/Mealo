<?php

namespace App\Models;

use App\Policies\RecipePolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

#[UsePolicy(RecipePolicy::class)]
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
        'image_path',
    ];

    /**
     * @param array<Ingredient> $ingredients_data
     */
    public function syncIngredients($ingredients_data): void
    {
        $pivotData = collect($ingredients_data)->mapWithKeys(function ($ingredient_data) {
            $ingredient = Ingredient::query()->firstOrCreate([
                'name' => $ingredient_data['name'],
                'user_id' => $this->user_id,
            ]);
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
            $tag = Tag::query()->firstOrCreate([
                'name' => $tag_data['name'],
                'user_id' => $this->user_id,
            ]);
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

    /**
     * Upload and store a recipe image
     */
    public function uploadImage(UploadedFile $file): string
    {
        $this->deleteImage();

        $filename = 'recipe_' . $this->id . '_' . $file->hashName();
        $directory = 'user_' . $this->user_id;

        $path = $file->storeAs($directory, $filename, 'recipe_images');

        $this->update(['image_path' => $path]);

        return $path;
    }

    /**
     * Delete the recipe image
     */
    public function deleteImage(): void
    {
        if ($this->image_path) {
            Storage::disk('recipe_images')->delete($this->image_path);
            $this->update(['image_path' => null]);
        }
    }

    /**
     * Get secure URL for recipe image
     */
    public function getImageUrl(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        $timestamp = $this->updated_at ? $this->updated_at->timestamp : time();
        return route('recipes.image', ['recipe' => $this->id]) . '?v=' . $timestamp;
    }

    /**
     * Boot method for model events
     */
    protected static function booted(): void
    {
        static::deleting(function (Recipe $recipe) {
            $recipe->deleteImage();
        });
    }
}
