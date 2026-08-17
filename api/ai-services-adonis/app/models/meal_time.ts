import { MealTimeSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Recipe from '#models/recipe'

export default class MealTime extends MealTimeSchema {
  @manyToMany(() => Recipe, {
    pivotTable: 'recipe_meal_time',
    pivotForeignKey: 'meal_time_id',
    pivotRelatedForeignKey: 'recipe_id',
    pivotTimestamps: true,
  })
  declare recipes: ManyToMany<typeof Recipe>
}
