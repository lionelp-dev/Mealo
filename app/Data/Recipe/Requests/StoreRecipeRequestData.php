<?php

namespace App\Data\Recipe\Requests;

use App\Data\Recipe\Entities\IngredientData;
use App\Data\Recipe\Entities\MealTimeData;
use App\Data\Recipe\Entities\StepData;
use App\Data\Recipe\Entities\TagData;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Image;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class StoreRecipeRequestData extends Data
{
    public function __construct(
        #[Min(0), Max(255)]
        public string $name,
        #[Min(0), Max(5000)]
        public ?string $description,
        #[Min(1), Max(50)]
        public int $serving_size,
        #[Min(0), Max(20160)]
        public int $preparation_time,
        #[Min(0), Max(20160)]
        public int $cooking_time,
        /** @var MealTimeData[] */
        public array $meal_times,
        /** @var IngredientData[] */
        public array $ingredients,
        /** @var StepData[] */
        public array $steps,
        /** @var TagData[] */
        public array $tags,
        #[Image, Mimes(['jpeg', 'jpg', 'png']), Max(5120)]
        public ?UploadedFile $image = null
    ) {}

}
