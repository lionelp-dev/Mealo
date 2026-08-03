<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $email
 * @property string $status
 * @property string|null $token
 * @property \Carbon\Carbon|null $token_expires_at
 * @property \Carbon\Carbon|null $account_expires_at
 * @property \Carbon\Carbon|null $approved_at
 * @property int|null $approved_by
 * @property int|null $user_id
 * @property string|null $rejection_reason
 */
class BetaRequest extends Model
{
    /** @use HasFactory<\Database\Factories\BetaRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'email',
        'status',
        'token',
        'token_expires_at',
        'account_expires_at',
        'approved_by',
        'approved_at',
        'user_id',
        'rejection_reason',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'token_expires_at' => 'datetime',
            'account_expires_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * The user created from this beta request.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The admin who approved this request.
     *
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Generate a unique token for the invitation.
     */
    public function generateToken(): void
    {
        $expirationDays = config('beta.token_expiration_days', 7);

        $this->token = Str::random(32);
        $this->token_expires_at = now()->addDays(is_numeric($expirationDays) ? (int) $expirationDays : 7);
    }

    /**
     * Check if the invitation token is valid.
     */
    public function isTokenValid(): bool
    {
        return $this->token !== null
            && $this->token_expires_at !== null
            && $this->token_expires_at->isFuture();
    }

    /**
     * Check if the invitation token has expired.
     */
    public function isTokenExpired(): bool
    {
        return $this->token_expires_at !== null
            && $this->token_expires_at->isPast();
    }

    /**
     * Check if the beta account has expired.
     */
    public function isAccountExpired(): bool
    {
        return $this->account_expires_at !== null
            && $this->account_expires_at->isPast();
    }

    /**
     * Approve the beta request.
     */
    public function approve(User $admin): void
    {
        $this->generateToken();
        $this->status = 'approved';
        $this->approved_by = $admin->id;
        $this->approved_at = now();
        $this->save();
    }

    /**
     * Reject the beta request.
     */
    public function reject(?string $reason = null): void
    {
        $this->status = 'rejected';
        $this->rejection_reason = $reason;
        $this->save();
    }

    /**
     * Mark the request as converted (user account created).
     */
    public function markAsConverted(User $user): void
    {
        $expirationDays = config('beta.expiration_days', 30);

        $this->status = 'converted';
        $this->user_id = $user->id;
        $this->account_expires_at = now()->addDays(is_numeric($expirationDays) ? (int) $expirationDays : 30);
        $this->save();
    }

    /**
     * Mark the request as expired.
     */
    public function markAsExpired(): void
    {
        $this->status = 'expired';
        $this->save();
    }

    /**
     * Scope a query to only include pending requests.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved requests.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include converted requests.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeConverted(Builder $query): Builder
    {
        return $query->where('status', 'converted');
    }

    /**
     * Scope a query to only include expired account requests.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeAccountExpired(Builder $query): Builder
    {
        return $query->where('status', 'converted')
            ->where('account_expires_at', '<', now());
    }

    /**
     * Find a beta request by its token.
     */
    public static function findByToken(string $token): ?self
    {
        return static::where('token', $token)->first();
    }
}
