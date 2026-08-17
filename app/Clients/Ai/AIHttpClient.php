<?php

namespace App\Clients\Ai;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;

final class AIHttpClient
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function post(string $uri, array $payload = [], int $timeout = 10): Response
    {
        $baseUrl = config('services.ai.url');
        $token = config('services.ai.token');

        if (! is_string($baseUrl)) {
            throw new InvalidArgumentException('AI service URL must be configured.');
        }

        if (! is_string($token)) {
            throw new InvalidArgumentException('AI service token must be configured.');
        }

        return Http::baseUrl($baseUrl)
            ->acceptJson()
            ->withToken($token)
            ->timeout($timeout)
            ->post($uri, $payload);
    }
}
