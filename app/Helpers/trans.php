<?php

if (! function_exists('t')) {
    function t(string $key, string $fallback = ''): string
    {
        $translated = __($key);

        return $translated === $key ? $fallback : $translated;
    }
}
