<?php

namespace App\Data\Recipe\Resources;

use App\Data\Recipe\Entities\MealTimeData;
use App\Data\Recipe\Entities\StepData;
use App\Data\Recipe\Entities\TagData;
use App\Models\Recipe;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeResourceData extends Data
{
    /**
     * @param  Lazy|Collection<int, RecipeIngredientResourceData>  $ingredients
     * @param  Lazy|Collection<int, MealTimeData>  $meal_times
     * @param  Lazy|Collection<int, StepData>  $steps
     * @param  Lazy|Collection<int, TagData>  $tags
     */
    public function __construct(
        public int $id,
        public int $user_id,
        public string $name,
        public ?string $description,
        public int $serving_size,
        public int $preparation_time,
        public int $cooking_time,
        public Lazy|Collection $meal_times,
        public Lazy|Collection $ingredients,
        public Lazy|Collection $steps,
        public Lazy|Collection $tags,
        public ?string $image_url,
        public ?CarbonImmutable $created_at,
        public ?CarbonImmutable $updated_at,
    ) {}

    public static function fromModel(Recipe $recipe): self
    {
        return new self(
            id: $recipe->id,
            user_id: $recipe->user_id,
            name: $recipe->name,
            description: $recipe->description,
            serving_size: $recipe->serving_size,
            preparation_time: $recipe->preparation_time,
            cooking_time: $recipe->cooking_time,
            meal_times: MealTimeData::collect($recipe->mealTimes),
            ingredients: Lazy::create(fn () => RecipeIngredientResourceData::collect($recipe->ingredients)),
            steps: StepData::collect($recipe->steps),
            tags: TagData::collect($recipe->tags),
            image_url: $recipe->getImageUrl(),
            created_at: $recipe->created_at?->toImmutable(),
            updated_at: $recipe->updated_at?->toImmutable(),
        );
    }
}
