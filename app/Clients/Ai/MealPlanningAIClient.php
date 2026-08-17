<?php

namespace App\Clients\Ai;

use RuntimeException;
use UnexpectedValueException;

final class MealPlanningAIClient
{
    public function __construct(
        private AIHttpClient $http,
    ) {}

    /**
     * @param  array<string,mixed>  $payload
     * @return list<array<array-key, mixed>>
     */
    public function generate(array $payload): array
    {
        $response = $this->http->post(
            '/internal/meal-plans/generate',
            $payload,
            120,
        );

        if ($response->failed()) {
            throw new RuntimeException(
                "AI meal plan generation request failed with status {$response->status()}."
            );
        }

        $data = $response->json();

        // Accept both the bare-array form ([{...}, {...}]) and the wrapped form ({"planned_meals": [...]}).
        if (is_array($data) && array_key_exists('planned_meals', $data)) {
            $data = $data['planned_meals'];
        }

        if (! is_array($data) || ! array_is_list($data)) {
            throw new UnexpectedValueException('AI meal plan generation response must be an array of planned meals.');
        }

        $plannedMeals = [];

        foreach ($data as $meal) {
            if (! is_array($meal)) {
                throw new UnexpectedValueException('AI meal plan generation response must be an array of planned meals.');
            }

            $plannedMeals[] = $meal;
        }

        return $plannedMeals;
    }
}
