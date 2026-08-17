import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipe_ingredient'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('recipe_id').notNullable().references('recipes.id').onDelete('CASCADE')
      table.uuid('ingredient_id').notNullable().references('ingredients.id')
      table.decimal('quantity', 10, 2).notNullable()
      table.string('unit').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
