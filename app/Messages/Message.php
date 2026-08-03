<?php

namespace App\Messages;

use Throwable;

abstract class Message
{
    protected string $message;

    public function __construct(?string $message = null, int $code = 0, ?Throwable $previous = null)
    {
        unset($code, $previous);

        $this->message = $message ?? '';
    }

    public function getMessage(): string
    {
        return $this->message;
    }
}
