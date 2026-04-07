<?php

namespace App\Models;

use App\Policies\WorkspaceInvitationPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property CarbonImmutable $expires_at
 */
#[UsePolicy(WorkspaceInvitationPolicy::class)]
class WorkspaceInvitation extends Model
{
    /** @use HasFactory<\Database\Factories\WorkspaceInvitationFactory> */
    use HasFactory;

    protected $fillable = [
        'workspace_id',
        'email',
        'role',
        'token',
        'invited_by',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'immutable_datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (WorkspaceInvitation $invitation) {
            if (empty($invitation->token)) {
                $invitation->token = (string) Str::uuid();
            }
            if (empty($invitation->expires_at)) {
                $invitation->expires_at = CarbonImmutable::now()->addDays(7);
            }
        });
    }

    /**
     * @return BelongsTo<Workspace, $this>
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function getRouteKeyName(): string
    {
        return 'token';
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return ! $this->isExpired();
    }

    public function accept(User $user): bool
    {
        if (! $this->isValid()) {
            return false;
        }

        if ($user->email !== $this->email) {
            return false;
        }

        // Load workspace if not already loaded and ensure it exists
        $workspace = $this->workspace;
        if ($workspace === null) {
            return false;
        }

        // Add user to workspace with role
        $workspace->users()->attach($user->id, [
            'joined_at' => now(),
        ]);

        // Give appropriate Spatie permissions based on invitation role
        match ($this->role) {
            'editor' => $workspace->giveEditorPermissions($user),
            'viewer' => $workspace->giveViewerPermissions($user),
        };

        // Delete the invitation
        $this->delete();

        return true;
    }
}
