<?php

namespace App\Data\Requests\Recipe;

use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use App\Data\Requests\Recipe\Entities\MealTimeRequestData;
use App\Data\Requests\Recipe\Entities\StepRequestData;
use App\Data\Requests\Recipe\Entities\TagRequestData;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeUpdateRequestData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $description,
        public int $serving_size,
        public int $preparation_time,
        public int $cooking_time,
        /** @var MealTimeRequestData[] */
        public array $meal_times,
        /** @var IngredientRequestData[] */
        public array $ingredients,
        /** @var StepRequestData[] */
        public array $steps,
        /** @var TagRequestData[] */
        public array $tags,
        #[LiteralTypeScriptType('File|null')]
        public ?UploadedFile $image = null
    ) {}

    /**
     * @return array<string, string>
     */
    public static function rules(): array
    {
        return [
            'id' => 'required|uuid:7',
            'name' => 'required|string|min:0|max:255',
            'description' => 'required|string|min:0|max:5000',
            'serving_size' => 'required|integer|min:1|max:50',
            'preparation_time' => 'required|integer|min:0|max:20160',
            'cooking_time' => 'required|integer|min:0|max:20160',
            'meal_times' => 'required|array|min:1|max:4',
            'ingredients' => 'required|array|min:1|max:255',
            'steps' => 'required|array|min:1|max:255',
            'tags' => 'required|array|min:1|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
        ];
    }
}
