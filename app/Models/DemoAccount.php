<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $demo_invite_id
 * @property string $token
 * @property \Carbon\CarbonImmutable $expires_at
 * @property \Carbon\CarbonImmutable $created_at
 */
class DemoAccount extends Model
{
    protected $fillable = [
        'user_id',
        'demo_invite_id',
        'token',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<DemoInvite, $this>
     */
    public function demoInvite(): BelongsTo
    {
        return $this->belongsTo(DemoInvite::class);
    }

    /**
     * Check if the demo account has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
