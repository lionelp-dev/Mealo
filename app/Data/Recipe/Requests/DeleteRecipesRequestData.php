<?php

namespace App\Data\Recipe\Requests;

use Spatie\LaravelData\Data;

class DeleteRecipesRequestData extends Data
{
    /**
     * @param  array<int>  $recipe_ids
     */
    public function __construct(
        public array $recipe_ids,
    ) {}
}
