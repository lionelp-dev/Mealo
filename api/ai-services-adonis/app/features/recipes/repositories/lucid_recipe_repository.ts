import type { RecipeRepository } from '../contracts/recipe_discovery_contracts.ts'

export class ExistingRecipeNamesRepository implements RecipeRepository {
  private readonly names: Set<string>

  constructor(names: string[]) {
    this.names = new Set(names.map((name) => this.normalize(name)))
  }

  async recipeNameExists(_ownerId: number, name: string) {
    return this.names.has(this.normalize(name))
  }

  private normalize(name: string) {
    return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr-FR')
  }
}
