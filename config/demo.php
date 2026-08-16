<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Demo access
    |--------------------------------------------------------------------------
    |
    | The demo feature lets visitors create a throwaway, isolated demo account
    | from a single share link (e.g. one put on a CV). There is no public
    | registration: the share link is the only public entry point.
    |
    | - "token" seeds the single DemoInvite record used by the share link
    |   (GET /demo/{token}).
    | - "max_uses" caps how many demo accounts that link can create.
    | - "link_expires_at" optionally expires the whole share link.
    | - "account_days" is the lifetime of each created demo account.
    |
    */

    'enabled' => env('DEMO_ENABLED', true),

    'token' => env('DEMO_TOKEN'),

    'max_uses' => (int) env('DEMO_MAX_USES', 50),

    'link_expires_at' => env('DEMO_LINK_EXPIRES_AT'),

    'account_days' => (int) env('DEMO_ACCOUNT_DAYS', 30),

];
