import { IngredientSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Recipe from '#models/recipe'
import User from '#models/user'

export default class Ingredient extends IngredientSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Recipe, {
    pivotTable: 'recipe_ingredient',
    pivotForeignKey: 'ingredient_id',
    pivotRelatedForeignKey: 'recipe_id',
    pivotColumns: ['quantity', 'unit'],
    pivotTimestamps: true,
  })
  declare recipes: ManyToMany<typeof Recipe>
}
