import { StepSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Recipe from '#models/recipe'

export default class Step extends StepSchema {
  @belongsTo(() => Recipe)
  declare recipe: BelongsTo<typeof Recipe>
}
