<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('mail.beta_invitation.subject') }}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #718096;  max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; ">
        <h1 style="color: #2d3748; margin-top: 0;">{{ __('mail.beta_invitation.greeting') }}</h1>

        <p style="font-size: 16px; margin-bottom: 20px;">
            {!! __('mail.beta_invitation.good_news') !!}
        </p>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>{{ __('mail.beta_invitation.warning_title') }}</strong> {{ __('mail.beta_invitation.warning_text') }}
            </p>
        </div>

        <p style="font-size: 16px; margin-bottom: 20px;">
            {{ __('mail.beta_invitation.activate_prompt') }}
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/beta/accept/' . $betaRequest->token) }}"
               style="display: inline-block; background-color: #61738d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                {{ __('mail.beta_invitation.activate_button') }}
            </a>
        </div>

        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
            {!! __('mail.beta_invitation.link_valid', ['date' => $betaRequest->token_expires_at->locale(app()->getLocale())->isoFormat('LL')]) !!}
        </p>

        <p style="font-size: 16px; margin-bottom: 0;">
            {{ __('mail.beta_invitation.closing') }}<br>
            <strong>{{ __('mail.beta_invitation.team') }}</strong>
        </p>
    </div>

    <div style="text-align: center; padding-block: 32px; color: #b0adc5; font-size: 14px;">
        <p style="font-size: 12px;">
            {{ __('mail.beta_invitation.footer_ignore') }}
        </p>
        <p style="font-size: 12px;">
            © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
        </p>
    </div>

</body>
</html>
