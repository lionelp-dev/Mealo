import db from '@adonisjs/lucid/services/db'
import type { RecipeRepository } from '../contracts/recipe_discovery_contracts.ts'
import { normalizeRecipeName } from '../utils/normalize_recipe_name.ts'

type RecipeNameRow = { name: string }

export class DirectRecipeNameRepository implements RecipeRepository {
  async findExistingRecipeNames(ownerId: number, names: string[]) {
    if (names.length === 0) return []

    const requestedNames = new Set(names.map(normalizeRecipeName))
    const recipes = (await db
      .connection('recipe_source')
      .from('recipes')
      .where('user_id', ownerId)
      .select('name')) as RecipeNameRow[]

    return recipes
      .map((recipe) => recipe.name)
      .filter((name) => requestedNames.has(normalizeRecipeName(name)))
  }
}
