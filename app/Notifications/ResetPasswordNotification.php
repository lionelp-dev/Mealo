<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use InvalidArgumentException;

class ResetPasswordNotification extends ResetPassword
{
    /**
     * Build the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $passwordBroker = config('auth.defaults.passwords');
        $passwordBroker = is_string($passwordBroker) ? $passwordBroker : 'users';
        $expireMinutes = config('auth.passwords.'.$passwordBroker.'.expire');
        $expireMinutes = is_numeric($expireMinutes) ? (int) $expireMinutes : 60;

        return (new MailMessage)
            ->subject(__('auth.reset_password_notification'))
            ->line(__('auth.reset_password_line_1'))
            ->action(__('auth.reset_password_action'), $this->resetUrl($notifiable))
            ->line(__('auth.reset_password_line_2', ['count' => $expireMinutes]))
            ->line(__('auth.reset_password_line_3'));
    }

    /**
     * Get the reset URL for the given notifiable.
     */
    protected function resetUrl(mixed $notifiable): string
    {
        if (! $notifiable instanceof CanResetPassword) {
            throw new InvalidArgumentException('Password reset notification requires a resettable notifiable.');
        }

        return url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }
}
