<p>You have been invited to join a workspace.</p>

<p>
    <a href="{{ $acceptUrl }}">
        Accept invitation
    </a>
</p>

<p>This invitation will expire on {{ $invitation->expires_at->format('d/m/Y') }}</p>

