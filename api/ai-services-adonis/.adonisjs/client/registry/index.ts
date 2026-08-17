/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'recipe_generation.generate': {
    methods: ["POST"],
    pattern: '/internal/recipes/generate',
    tokens: [{"old":"/internal/recipes/generate","type":0,"val":"internal","end":""},{"old":"/internal/recipes/generate","type":0,"val":"recipes","end":""},{"old":"/internal/recipes/generate","type":0,"val":"generate","end":""}],
    types: placeholder as Registry['recipe_generation.generate']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
