<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenAI;
use OpenAI\Contracts\ClientContract;

class OpenAIServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('openai.client', function (): ?ClientContract {
            $apiKey = config('services.openai.api_key');

            if (! is_string($apiKey) || $apiKey === '') {
                return null;
            }

            $baseUri = config('services.openai.base_uri', 'https://api.openai.com/v1');
            $appUrl = config('app.url');
            $appName = config('app.name');

            return OpenAI::factory()
                ->withApiKey($apiKey)
                ->withBaseUri(is_string($baseUri) ? $baseUri : 'https://api.openai.com/v1')
                ->withHttpHeader('HTTP-Referer', is_string($appUrl) ? $appUrl : '')
                ->withHttpHeader('X-Title', is_string($appName) ? $appName : '')
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
