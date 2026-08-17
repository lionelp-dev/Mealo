import { TagSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Recipe from '#models/recipe'
import User from '#models/user'

export default class Tag extends TagSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Recipe, {
    pivotTable: 'recipe_tag',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'recipe_id',
    pivotTimestamps: true,
  })
  declare recipes: ManyToMany<typeof Recipe>
}
