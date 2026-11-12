import { ChatOpenRouter } from '@langchain/openrouter'
import z from 'zod'
import { createRecipeStoreRequestSchema } from '../../../data/request/recipe/schemas/recipe_store.request.schema.ts'
import type {
  DiscoveryCatalog,
  GeneratedDiscoveryRecipe,
  RecipeNameGenerationRequest,
  RecipeGenerator,
} from '../contracts/recipe_discovery_contracts.ts'

export class OpenRouterRecipeGenerator implements RecipeGenerator {
  private model() {
    return new ChatOpenRouter({ model: 'openai/gpt-4o-mini', temperature: 0.8 })
  }

  async generateNames(requests: RecipeNameGenerationRequest[], excludedNames: string[]) {
    if (requests.length === 0) return []

    const response = await this.model()
      .withStructuredOutput(
        z.object({ names: z.array(z.string().trim().min(1).max(255)).length(requests.length) }),
        {
          method: 'jsonSchema',
          strict: true,
        }
      )
      .invoke([
        {
          role: 'system',
          content:
            'Tu es un chef cuisinier. Propose exactement un nom de recette réaliste par demande, dans le même ordre. Tous les noms doivent être distincts : ne propose pas deux variantes quasiment identiques du même plat. Cherche une bonne diversité dans les plats, les ingrédients principaux, les cuisines et les méthodes de préparation. Chaque nom doit aussi être distinct des noms exclus.',
        },
        {
          role: 'user',
          content: `Demandes :\n${requests
            .map((request, index) => `${index + 1}. ${request.prompt}`)
            .join('\n\n')}\n\nNoms exclus : ${excludedNames.join(', ') || 'aucun'}`,
        },
      ])
    return response.names
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
Les moments de repas sont une contrainte métier, jamais une simple étiquette : la recette doit concrètement convenir à au moins l’un de ceux autorisés. Adapte le type de plat, les ingrédients et les portions, puis n’associe que les moments pour lesquels elle est réellement adaptée.
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
