<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenAI;

class OpenAIServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('openai.client', function ($app) {
            $apiKey = config('services.openai.api_key');

            if (!$apiKey) {
                return null;
            }

            return OpenAI::factory()
                ->withApiKey($apiKey)
                ->withBaseUri(config('services.openai.base_uri', 'https://api.openai.com/v1'))
                ->withHttpHeader('HTTP-Referer', config('app.url'))
                ->withHttpHeader('X-Title', config('app.name'))
                ->make();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

