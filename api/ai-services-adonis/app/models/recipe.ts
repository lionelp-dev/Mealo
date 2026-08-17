import { RecipeSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Ingredient from '#models/ingredient'
import MealTime from '#models/meal_time'
import Step from '#models/step'
import Tag from '#models/tag'
import User from '#models/user'

export default class Recipe extends RecipeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Step)
  declare steps: HasMany<typeof Step>

  @manyToMany(() => Ingredient, {
    pivotTable: 'recipe_ingredient',
    pivotForeignKey: 'recipe_id',
    pivotRelatedForeignKey: 'ingredient_id',
    pivotColumns: ['quantity', 'unit'],
    pivotTimestamps: true,
  })
  declare ingredients: ManyToMany<typeof Ingredient>

  @manyToMany(() => Tag, {
    pivotTable: 'recipe_tag',
    pivotForeignKey: 'recipe_id',
    pivotRelatedForeignKey: 'tag_id',
    pivotTimestamps: true,
  })
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => MealTime, {
    pivotTable: 'recipe_meal_time',
    pivotForeignKey: 'recipe_id',
    pivotRelatedForeignKey: 'meal_time_id',
    pivotTimestamps: true,
  })
  declare mealTimes: ManyToMany<typeof MealTime>
}
