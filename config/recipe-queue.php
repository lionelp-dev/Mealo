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
];
