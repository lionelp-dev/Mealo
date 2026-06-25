<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Recipe Generation Queue Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for AI recipe generation with rate limiting to respect
    | OpenRouter/OpenAI API limits and avoid hitting rate limits.
    |
    */

    // Rate limiting settings
    'rate_limit' => [
        'delay_between_jobs' => env('RECIPE_JOB_DELAY', 6), // 6 seconds between jobs
    ],

    'missing_api_key_release_delay' => env('RECIPE_JOB_MISSING_API_KEY_RELEASE_DELAY', 300),
];
