/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  recipeGeneration: {
    generate: typeof routes['recipe_generation.generate']
  }
}
