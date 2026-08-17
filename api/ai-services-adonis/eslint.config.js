import { configApp } from '@adonisjs/eslint-config'

export default [
  // database/schema.ts is auto-generated (node ace migration:run) and must not be edited
  { ignores: ['database/schema.ts'] },
  ...configApp(),
]
