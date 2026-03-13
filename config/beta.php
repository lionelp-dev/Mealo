<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Beta Account Expiration
    |--------------------------------------------------------------------------
    |
    | Number of days after account creation before a beta account expires
    | and is automatically deleted. Set to 0 to disable auto-expiration.
    |
    */
    'expiration_days' => (int) env('BETA_EXPIRATION_DAYS', 30),

    /*
    |--------------------------------------------------------------------------
    | Beta Invitation Token Expiration
    |--------------------------------------------------------------------------
    |
    | Number of days the invitation link is valid after admin approval.
    |
    */
    'token_expiration_days' => (int) env('BETA_TOKEN_EXPIRATION_DAYS', 7),
];
