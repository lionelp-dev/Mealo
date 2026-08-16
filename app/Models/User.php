<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $locale
 * @property \Carbon\CarbonImmutable $created_at
 */
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
            'created_at' => 'immutable_datetime',
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
     * @return HasOne<DemoAccount, $this>
     */
    public function demoAccount(): HasOne
    {
        return $this->hasOne(DemoAccount::class);
    }

    /**
     * Check whether this user is a demo account.
     */
    public function isDemo(): bool
    {
        return $this->demoAccount()->exists();
    }

    /**
     * Scope a query to only include demo users.
     *
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeDemo(Builder $query): Builder
    {
        return $query->whereHas('demoAccount');
    }

    /**
     * Determine if the user has the global admin role.
     *
     * Checks the role assignment directly, ignoring the current permission
     * team (workspace) context, since admin access is app-wide.
     */
    public function isAdmin(): bool
    {
        /** @var array<string, string> $tableNames */
        $tableNames = config('permission.table_names');
        /** @var array<string, string> $columnNames */
        $columnNames = config('permission.column_names');

        return DB::table($tableNames['model_has_roles'])
            ->where($columnNames['model_morph_key'], $this->getKey())
            ->where('model_type', $this->getMorphClass())
            ->whereIn('role_id', Role::query()->where('name', 'admin')->pluck('id'))
            ->exists();
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
     *
     * @param  string  $token
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
