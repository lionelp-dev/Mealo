import {
  BetaRequestSchema,
  PlannedMealSchema,
  UserSchema,
  WorkspaceInvitationSchema,
  WorkspaceSchema,
} from '#database/schema'
import Ingredient from '#models/ingredient'
import Recipe from '#models/recipe'
import Tag from '#models/tag'
import config from '@adonisjs/core/services/config'
import { hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class User extends UserSchema {
  @hasMany(() => Recipe)
  declare recipes: HasMany<typeof Recipe>

  @hasMany(() => Ingredient)
  declare ingredients: HasMany<typeof Ingredient>

  @hasMany(() => Tag)
  declare tags: HasMany<typeof Tag>

  @hasMany(() => PlannedMealSchema)
  declare plannedMeals: HasMany<typeof PlannedMealSchema>

  @hasMany(() => WorkspaceSchema, {
    foreignKey: 'ownerId',
  })
  declare ownedWorkspaces: HasMany<typeof WorkspaceSchema>

  @manyToMany(() => WorkspaceSchema, {
    pivotTable: 'workspace_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'workspace_id',
    pivotColumns: ['joined_at'],
    pivotTimestamps: true,
  })
  declare workspaces: ManyToMany<typeof WorkspaceSchema>

  @hasMany(() => WorkspaceInvitationSchema, {
    foreignKey: 'invitedBy',
  })
  declare workspacesInvitations: HasMany<typeof WorkspaceInvitationSchema>

  @hasOne(() => BetaRequestSchema)
  declare betaRequest: HasOne<typeof BetaRequestSchema>

  get isBetaUser() {
    return this.betaRequest?.status === 'converted'
  }

  async defaultWorkspace() {
    return (this as User)
      .related('workspaces')
      .query()
      .where('is_personal', true)
      .where('is_default', true)
      .first()
  }

  preferredLocale() {
    return this.locale ?? config.get('app.locale', 'fr')
  }
}
