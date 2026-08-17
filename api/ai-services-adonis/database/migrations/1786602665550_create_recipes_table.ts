import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.string('name').notNullable()
      table.string('description', 1000).notNullable()
      table.integer('serving_size').notNullable().defaultTo(1)
      table.integer('preparation_time').notNullable()
      table.integer('cooking_time').notNullable()
      table.string('image_path').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
