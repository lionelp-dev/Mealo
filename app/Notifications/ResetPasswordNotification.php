<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    /**
     * Build the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $expireMinutes = config('auth.passwords.'.config('auth.defaults.passwords').'.expire');

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
        return url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }
}
