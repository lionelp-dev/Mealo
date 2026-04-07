<?php

namespace App\Models;

use App\Policies\WorkspacePolicy;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property bool $is_default_
 * @property bool $is_personal
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $expired_at
 */
#[UsePolicy(WorkspacePolicy::class)]
class Workspace extends Model
{
    protected $fillable = [
        'name',
        'owner_id',
        'is_personal',
        'is_default',
    ];

    protected $casts = [
        'is_personal' => 'boolean',
        'is_default' => 'boolean',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
    ];

    /**
     * @return BelongsTo<User,$this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return BelongsToMany<User, $this, WorkspaceUser>
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_users')
            ->using(WorkspaceUser::class)
            ->withTimestamps()
            ->withPivot(['joined_at']);
    }

    /**
     * @return HasMany<PlannedMeal,$this>
     */
    public function plannedMeals(): HasMany
    {
        return $this->hasMany(PlannedMeal::class);
    }

    /**
     * @return HasMany<WorkspaceInvitation,$this>
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(WorkspaceInvitation::class);
    }

    public static function createPersonalWorkspace(User $user): self
    {
        return self::create([
            'name' => 'Mon espace',
            'owner_id' => $user->id,
            'is_personal' => true,
            'is_default' => true,
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
            $owner = $workspace->owner;
            if ($owner instanceof User) {
                $workspace->giveOwnerPermissions($owner);
            }
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
     * Remove all non-owner members and their permissions from this workspace
     */
    public function removeAllNonOwnerMembers(): void
    {
        $nonOwners = $this->users()->where('user_id', '!=', $this->owner_id)->get();

        /** @var User $user */
        foreach ($nonOwners as $user) {
            setPermissionsTeamId($this->id);
            $this->removeUserPermissions($user);
            $this->plannedMeals()->where('user_id', $user->id)->delete();
            $this->users()->detach($user->id);
        }
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
