<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('mail.beta_request_confirmation.subject') }}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #718096; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
        <h1 style="color: #2d3748; margin-top: 0;">{{ __('mail.beta_request_confirmation.greeting') }}</h1>

        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            {!! __('mail.beta_request_confirmation.confirmation') !!}
        </p>

        <p style="font-size: 16px; margin-bottom: 20px;">
            {{ __('mail.beta_request_confirmation.review_message') }}
        </p>

        <p style="font-size: 16px; margin-bottom: 0;">
            {{ __('mail.beta_request_confirmation.closing') }}<br>
            <strong>{{ __('mail.beta_request_confirmation.team') }}</strong>
        </p>
    </div>

    <div style="text-align: center; padding-block: 32px; color: #b0adc5; font-size: 14px;">
        <p style="font-size: 12px;">
            © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
        </p>
    </div>
</body>
</html>
