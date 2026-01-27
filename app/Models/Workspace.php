<?php

namespace App\Models;

use App\Policies\WorkspacePolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[UsePolicy(WorkspacePolicy::class)]
class Workspace extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'is_personal',
    ];

    protected $casts = [
        'is_personal' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_users')
            ->withPivot(['joined_at'])
            ->withTimestamps();
    }

    public function plannedMeals(): HasMany
    {
        return $this->hasMany(PlannedMeal::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class);
    }

    public static function createPersonalWorkspace(User $user): self
    {
        return self::create([
            'name' => 'Mes repas',
            'description' => 'Mon espace personnel de planification de repas',
            'owner_id' => $user->id,
            'is_personal' => true,
        ]);
    }

    protected static function booted(): void
    {
        static::created(function (Workspace $workspace) {
            // Add owner to workspace first (membership tracking)
            $workspace->users()->attach($workspace->owner_id, [
                'joined_at' => now(),
            ]);

            // Then assign owner permissions
            $workspace->giveOwnerPermissions($workspace->owner);
        });
    }

    /**
     * Give owner permissions to a user
     */
    public function giveOwnerPermissions(User $user): void
    {
        setPermissionsTeamId($this->id);
        $user->removeRole(['editor', 'viewer']);
        $user->assignRole('owner');
    }

    /**
     * Give editor permissions to a user
     */
    public function giveEditorPermissions(User $user): void
    {
        setPermissionsTeamId($this->id);
        $user->removeRole(['owner', 'viewer']);
        $user->assignRole('editor');
    }

    /**
     * Give viewer permissions to a user
     */
    public function giveViewerPermissions(User $user): void
    {
        setPermissionsTeamId($this->id);
        $user->removeRole(['owner', 'editor']);
        $user->assignRole('viewer');
    }

    /**
     * Remove all workspace permissions from a user
     */
    public function removeUserPermissions(User $user): void
    {
        $user->removeRole(['owner', 'editor', 'viewer']);
    }

    /**
     * Check if user can edit planning (Spatie version)
     */
    public function canUserEditPlanning(User $user): bool
    {
        setPermissionsTeamId($this->id);
        return $user->hasPermissionTo('planning.edit');
    }

    /**
     * Check if user can manage workspace (Spatie version)
     */
    public function canUserManageWorkspace(User $user): bool
    {
        setPermissionsTeamId($this->id);
        return $user->hasPermissionTo('workspace.manage');
    }

    /**
     * Check if user is a member of this workspace
     */
    public function hasUser(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }

    /**
     * Get user role in this workspace
     */
    public function getUserRole(User $user): ?string
    {
        setPermissionsTeamId($this->id);

        if ($user->hasRole('owner')) {
            return 'owner';
        }

        if ($user->hasRole('editor')) {
            return 'editor';
        }

        if ($user->hasRole('viewer')) {
            return 'viewer';
        }

        return null;
    }

    /**
     * Check if user has a specific role in this workspace
     */
    public function userHasRole(User $user, string $role): bool
    {
        return $this->getUserRole($user) === $role;
    }
}
