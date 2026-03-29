<?php

namespace App\Data\Resources\Recipe;

use App\Data\Resources\Recipe\Entities\MealTimeResourceData;
use App\Data\Resources\Recipe\Entities\TagResourceData;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeAIPromptResourceData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public int $serving_size,
        /** @var Collection<int, MealTimeResourceData> */
        #[LiteralTypeScriptType('Array<MealTimeResourceData>')]
        public Collection $meal_times,
        /** @var Collection<int, TagResourceData> */
        #[LiteralTypeScriptType('Array<TagResourceData>')]
        public Collection $tags,
    ) {}
}
