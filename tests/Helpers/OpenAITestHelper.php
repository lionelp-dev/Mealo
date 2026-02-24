<?php

namespace Tests\Helpers;

use Exception;
use OpenAI\Responses\Chat\CreateResponse;
use OpenAI\Testing\ClientFake;

/**
 * Helper class for mocking OpenAI API responses in tests
 *
 * Uses the official ClientFake implementation from openai-php/client
 * Source: https://github.com/openai-php/client/blob/main/README.md#testing
 */
class OpenAITestHelper
{
    /**
     * Mock a successful recipe generation response
     *
     * @param  array  $recipe  The recipe data to return from the mocked API
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockSuccessfulRecipeGeneration(array $recipe): ClientFake
    {
        $client = new ClientFake([
            CreateResponse::fake([
                'choices' => [
                    [
                        'message' => [
                            'tool_calls' => [
                                [
                                    'id' => 'call_'.bin2hex(random_bytes(12)),
                                    'type' => 'function',
                                    'function' => [
                                        'name' => 'generate_recipe',
                                        'arguments' => json_encode($recipe),
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]),
        ]);

        app()->instance('openai.client', $client);

        return $client;
    }

    /**
     * Mock a successful meal plan generation response
     *
     * @param  array  $plannedMeals  The planned meals data to return from the mocked API
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockSuccessfulMealPlanGeneration(array $plannedMeals): ClientFake
    {
        $client = new ClientFake([
            CreateResponse::fake([
                'choices' => [
                    [
                        'message' => [
                            'tool_calls' => [
                                [
                                    'id' => 'call_'.bin2hex(random_bytes(12)),
                                    'type' => 'function',
                                    'function' => [
                                        'name' => 'generate_meal_plan',
                                        'arguments' => json_encode([
                                            'planned_meals' => $plannedMeals,
                                        ]),
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]),
        ]);

        app()->instance('openai.client', $client);

        return $client;
    }

    /**
     * Mock an OpenAI API error exception
     *
     * Throws an exception when the API is called, simulating an API error
     *
     * @param  string  $message  The error message
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockOpenAIErrorException(string $message = 'OpenAI API error'): ClientFake
    {
        $client = new ClientFake([
            new Exception($message),
        ]);

        app()->instance('openai.client', $client);

        return $client;
    }

    /**
     * Mock an OpenAI rate limit error (429)
     *
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockOpenAIRateLimit(): ClientFake
    {
        return self::mockOpenAIErrorException('Rate limit exceeded');
    }

    /**
     * Mock an OpenAI invalid API key error (401)
     *
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockOpenAIInvalidApiKey(): ClientFake
    {
        return self::mockOpenAIErrorException('Invalid API key');
    }

    /**
     * Mock an OpenAI server error (500)
     *
     * @return ClientFake The fake client instance for assertions
     */
    public static function mockOpenAIServerError(): ClientFake
    {
        return self::mockOpenAIErrorException('Internal server error');
    }
}
