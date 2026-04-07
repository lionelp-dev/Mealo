<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasLocalePreference
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    use HasRoles;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'locale',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'locale' => 'string',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (User $user) {
            Workspace::createPersonalWorkspace($user);
        });
    }

    /**
     * @return HasMany<Recipe, $this >
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    /**
     * @return HasMany<PlannedMeal, $this>
     */
    public function plannedMeals(): HasMany
    {
        return $this->hasMany(PlannedMeal::class);
    }

    /**
     * @return HasMany<Workspace, $this>
     */
    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    /**
     * @return BelongsToMany<Workspace, $this, WorkspaceUser>
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_users')
            ->using(WorkspaceUser::class)
            ->withTimestamps()
            ->withPivot(['joined_at']);
    }

    public function defaultWorkspace(): ?Workspace
    {
        return $this->workspaces()
            ->where('is_personal', true)
            ->where('is_default', true)
            ->first();
    }

    /**
     * @return HasMany<WorkspaceInvitation, $this>
     */
    public function workspacesInvitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class, 'invited_by');
    }

    /**
     * @return HasOne<BetaRequest, $this>
     */
    public function betaRequest(): HasOne
    {
        return $this->hasOne(BetaRequest::class);
    }

    /**
     * Check if the user is a beta user.
     */
    public function getIsBetaUserAttribute(): bool
    {
        return $this->betaRequest?->status === 'converted';
    }

    /**
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        /** @var string $locale */
        $locale = $this->locale ?? config('app.locale', 'fr');

        return $locale;
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
