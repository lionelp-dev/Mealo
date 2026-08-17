import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('locale', 5).notNullable().defaultTo('fr')
      table.timestamp('email_verified_at').nullable()
      table.string('password').notNullable()
      table.string('remember_token', 100).nullable()
      table.text('two_factor_secret').nullable()
      table.text('two_factor_recovery_codes').nullable()
      table.timestamp('two_factor_confirmed_at').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('password_reset_tokens', (table) => {
      table.string('email').primary()
      table.string('token').notNullable()
      table.timestamp('created_at').nullable()
    })

    this.schema.createTable('sessions', (table) => {
      table.string('id').primary()
      table.integer('user_id').unsigned().nullable().index()
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.text('payload').notNullable()
      table.integer('last_activity').notNullable().index()
    })
  }

  async down() {
    this.schema.dropTable('sessions')
    this.schema.dropTable('password_reset_tokens')
    this.schema.dropTable(this.tableName)
  }
}
