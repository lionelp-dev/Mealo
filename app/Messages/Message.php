<?php

namespace App\Messages;

abstract class Message
{
    protected string $message;

    public function __construct(?string $message = null)
    {
        $this->message = $message ?? '';
    }

    public function getMessage(): string
    {
        return $this->message;
    }
}
