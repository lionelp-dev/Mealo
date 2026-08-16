<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WorkspaceInvitationMail;
use App\Models\User;
use App\Models\WorkspaceInvitation;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Str;

class MailPreviewController extends Controller
{
    public function workspaceInvitation(string $locale): WorkspaceInvitationMail
    {
        app()->setLocale($locale);

        $invitation = new WorkspaceInvitation([
            'email' => 'colleague@example.com',
            'token' => 'preview-invitation-token',
            'expires_at' => now()->addDays(7),
        ]);

        $invitation->exists = false;

        return new WorkspaceInvitationMail($invitation);
    }

    public function resetPassword(string $locale): \Illuminate\Notifications\Messages\MailMessage
    {
        app()->setLocale($locale);

        $user = new User([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'locale' => $locale,
        ]);
        $user->exists = false;

        $token = 'preview-reset-token-'.Str::random(40);
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => 'john@example.com',
        ], false));

        $notification = new ResetPasswordNotification($url);

        return $notification->toMail($user);
    }
}
