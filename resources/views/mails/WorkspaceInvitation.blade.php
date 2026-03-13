<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('mail.workspace_invitation.subject') }}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #718096; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
        <h1 style="color: #2d3748; margin-top: 0;">{{ __('mail.workspace_invitation.greeting') }}</h1>

        <p style="font-size: 16px;">
            {!! __('mail.workspace_invitation.message') !!}
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $acceptUrl }}"
               style="display: inline-block; background-color: #61738d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                {{ __('mail.workspace_invitation.accept_button') }}
            </a>
        </div>

        <p style="font-size: 14px; color: #6b7280;">
            {{ __('mail.workspace_invitation.expires', ['date' => $invitation->expires_at->locale(app()->getLocale())->isoFormat('LL')]) }}
        </p>

        <p style="font-size: 16px;">
            {{ __('mail.workspace_invitation.closing') }}
        </p>
    </div>

    <div style="text-align: center; padding-block: 32px; color: #b0adc5; font-size: 14px;">
        <p style="font-size: 12px;">
            © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
        </p>
    </div>
</body>
</html>
