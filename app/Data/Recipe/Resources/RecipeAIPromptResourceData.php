<?php

namespace App\Data\Recipe\Resources;

use App\Data\Recipe\Entities\MealTimeData;
use App\Data\Recipe\Entities\TagData;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeAIPromptResourceData extends Data
{
    /**
     * @param  Collection<int, MealTimeData>  $meal_times
     * @param  Collection<int, TagData>  $tags
     */
    public function __construct(
        public int $id,
        public string $name,
        public int $serving_size,
        #[DataCollectionOf(MealTimeData::class)]
        public Collection $meal_times,
        #[DataCollectionOf(TagData::class)]
        public Collection $tags,
    ) {}
}
