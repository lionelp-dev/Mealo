<?php

namespace App\Concerns;

use Throwable;

trait HasDefaultMessage
{
    abstract protected static function defaultMessage(): string;

    protected static function translationKey(): ?string
    {
        return null;
    }

    public static function message(): string
    {
        $translationKey = static::translationKey();

        if ($translationKey !== null) {
            return t($translationKey, static::defaultMessage());
        }

        return static::defaultMessage();
    }

    public function __construct(?string $message = null, int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message ?? self::message(), $code, $previous);
    }
}
