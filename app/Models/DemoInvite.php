<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $token
 * @property string|null $label
 * @property int $max_uses
 * @property int $used_count
 * @property \Carbon\CarbonImmutable|null $expires_at
 * @property bool $is_active
 */
class DemoInvite extends Model
{
    protected $fillable = [
        'token',
        'label',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'expires_at' => 'immutable_datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<DemoAccount, $this>
     */
    public function demoAccounts(): HasMany
    {
        return $this->hasMany(DemoAccount::class);
    }

    /**
     * Whether this share link can still create a demo account.
     */
    public function isUsable(): bool
    {
        return $this->is_active
            && $this->used_count < $this->max_uses
            && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /**
     * Increment the usage counter after a demo account is created.
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }
}
