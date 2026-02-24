<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class WorkspaceInvitation extends Model
{
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
        'expires_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (WorkspaceInvitation $invitation) {
            if (empty($invitation->token)) {
                $invitation->token = Str::random(32);
            }
            if (empty($invitation->expires_at)) {
                $invitation->expires_at = now()->addDays(7);
            }
        });
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
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

        // Add user to workspace without role (only tracking membership)
        $this->workspace->users()->attach($user->id, [
            'joined_at' => now(),
        ]);

        // Give appropriate Spatie permissions based on invitation role
        match ($this->role) {
            'owner' => $this->workspace->giveOwnerPermissions($user),
            'editor' => $this->workspace->giveEditorPermissions($user),
            'viewer' => $this->workspace->giveViewerPermissions($user),
        };

        // Delete the invitation
        $this->delete();

        return true;
    }
}
