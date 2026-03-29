<?php

namespace App\Data\Resources\Recipe\Entities;

use App\Models\Recipe;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeResourceData extends Data
{
    public function __construct(
        public string $id,
        public int $user_id,
        public string $name,
        public string $description,
        public int $serving_size,
        public int $preparation_time,
        public int $cooking_time,
        /** @var Collection<int, MealTimeResourceData> */
        #[LiteralTypeScriptType('Array<MealTimeResourceData>')]
        public Collection $meal_times,

        /** @var Lazy|Collection<int, RecipeIngredientResourceData> */
        #[LiteralTypeScriptType('Array<RecipeIngredientResourceData>|undefined')]
        public Lazy|Collection $ingredients,

        /** @var Collection<int, StepResourceData> */
        #[LiteralTypeScriptType('Array<StepResourceData>')]
        public Collection $steps,

        /** @var Collection<int, TagResourceData> */
        #[LiteralTypeScriptType('Array<TagResourceData>')]
        public Collection $tags,
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
            meal_times: MealTimeResourceData::collect($recipe->mealTimes),
            ingredients: Lazy::create(fn () => RecipeIngredientResourceData::collect($recipe->ingredients)),
            steps: StepResourceData::collect($recipe->steps),
            tags: TagResourceData::collect($recipe->tags),
            image_url: $recipe->getImageUrl(),
            created_at: $recipe->created_at?->toImmutable(),
            updated_at: $recipe->updated_at?->toImmutable(),
        );
    }
}
