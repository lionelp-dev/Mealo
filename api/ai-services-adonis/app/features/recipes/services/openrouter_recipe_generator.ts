import { ChatOpenRouter } from '@langchain/openrouter'
import z from 'zod'
import { createRecipeStoreRequestSchema } from '../../../data/request/recipe/schemas/recipe_store.request.schema.ts'
import type {
  DiscoveryCatalog,
  GeneratedDiscoveryRecipe,
  RecipeGenerator,
} from '../contracts/recipe_discovery_contracts.ts'

export class OpenRouterRecipeGenerator implements RecipeGenerator {
  private model() {
    return new ChatOpenRouter({ model: 'openai/gpt-4o-mini', temperature: 0.8 })
  }

  async generateName(prompt: string, excludedNames: string[]) {
    const response = await this.model()
      .withStructuredOutput(z.object({ name: z.string().trim().min(1).max(255) }), {
        method: 'jsonSchema',
        strict: true,
      })
      .invoke([
        {
          role: 'system',
          content:
            'Tu es un chef cuisinier. Propose un unique nom de recette réaliste, distinct des noms exclus.',
        },
        {
          role: 'user',
          content: `Demande : ${prompt}\nNoms exclus : ${excludedNames.join(', ') || 'aucun'}`,
        },
      ])
    return response.name
  }

  async generateRecipe(prompt: string, name: string, catalog: DiscoveryCatalog) {
    const mealTimeIdBySlug = new Map(
      catalog.meal_times.map((mealTime) => [mealTime.slug, mealTime.id])
    )
    const schema = createRecipeStoreRequestSchema(catalog)
    const response = await this.model()
      .withStructuredOutput(schema, { method: 'jsonSchema', strict: true })
      .invoke([
        {
          role: 'system',
          content: `Tu es un chef cuisinier expert. Génère une recette complète et réaliste pour le nom fourni.
Respecte strictement le schéma. Le nom doit correspondre exactement au nom demandé.
Catégories autorisées : ${catalog.ingredient_categories.map((category) => `${category.id}: ${category.name}`).join(', ')}.
Moments de repas autorisés : ${catalog.meal_times.map((mealTime) => mealTime.slug).join(', ')}.
L'image et image_data_url doivent être null.`,
        },
        { role: 'user', content: `Demande : ${prompt}\nNom imposé : ${name}` },
      ])

    return {
      ...response,
      description: response.description,
      image_data_url: null,
      meal_times: response.meal_times.map((mealTime) => ({
        id: mealTimeIdBySlug.get(mealTime.slug)!,
        slug: mealTime.slug,
      })),
    } satisfies GeneratedDiscoveryRecipe
  }
}
