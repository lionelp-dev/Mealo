<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use TwoFactorAuthenticatable;
    use HasRoles;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
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
        ];
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
     * @return BelongsToMany<Workspace>
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_users')
            ->withPivot(['joined_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<WorkspaceInvitation, $this>
     */
    public function workspaceInvitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class, 'invited_by');
    }

    protected static function booted(): void
    {
        static::created(function (User $user) {
            Workspace::createPersonalWorkspace($user);
        });
    }

    /**
     * Get user's personal workspace
     */
    public function getPersonalWorkspace(): ?Workspace
    {
        return $this->ownedWorkspaces()->where('is_personal', true)->first();
    }

    /**
     * Get all accessible workspaces for this user
     */
    public function getAccessibleWorkspaces()
    {
        return $this->workspaces()
            ->orderBy('workspaces.is_personal', 'desc')
            ->orderBy('workspaces.name')
            ->withPivot('joined_at')
            ->get();
    }
}
