<?php

namespace App\Data\Requests\Recipe;

use App\Data\Requests\Recipe\Entities\IngredientRequestData;
use App\Data\Requests\Recipe\Entities\MealTimeRequestData;
use App\Data\Requests\Recipe\Entities\StepRequestData;
use App\Data\Requests\Recipe\Entities\TagRequestData;
use Illuminate\Http\UploadedFile;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RecipeAIGeneratedStoreRequestData extends RecipeStoreRequestData
{
    /**
     * @param MealTimeRequestData[] $meal_times
     * @param IngredientRequestData[] $ingredients
     * @param StepRequestData[] $steps
     * @param TagRequestData[] $tags
     */
    public function __construct(
        string $name,
        string $description,
        int $serving_size,
        int $preparation_time,
        int $cooking_time,
        array $meal_times,
        array $ingredients,
        array $steps,
        array $tags,
        ?UploadedFile $image = null,
        public ?string $image_data_url = null,
    ) {
        parent::__construct(
            name: $name,
            description: $description,
            serving_size: $serving_size,
            preparation_time: $preparation_time,
            cooking_time: $cooking_time,
            meal_times: $meal_times,
            ingredients: $ingredients,
            steps: $steps,
            tags: $tags,
            image: $image,
        );
    }

    public static function rules(): array
    {
        return [
            ...parent::rules(),
            'image_data_url' => 'nullable|string|max:7000000',
        ];
    }
}
