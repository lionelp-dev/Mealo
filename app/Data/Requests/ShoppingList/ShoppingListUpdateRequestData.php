<?php

namespace App\Data\Requests\ShoppingList;

use App\Data\Requests\ShoppingList\Entities\ShoppingListPlannedMealIngredientRequestData;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ShoppingListUpdateRequestData extends Data
{
    public function __construct(
        /** @var ShoppingListPlannedMealIngredientRequestData[] */
        public array $shopping_list_planned_meal_ingredients,
    ) {}

    /**
     * @return array<string, array<string>>
     */
    public static function rules(): array
    {
        return [
            'shopping_list_planned_meal_ingredients' => ['required', 'array'],
        ];
    }
}
