import type { GraphNode } from '@langchain/langgraph'
import { ChatOpenRouter } from '@langchain/openrouter'
import z from 'zod'

import { recipeStoreRequestSchema } from '../../../data/request/recipe/schemas/recipe_store.request.schema.ts'
import type { GraphState } from '../recipe_generation_state.ts'
import { chunk } from '../utils/chunk.ts'
import { generateSeed } from '../utils/generate_seed.ts'

const RECIPES_PER_BATCH = 5
const MAX_CONCURRENT_RECIPE_GENERATIONS = 5

const model = new ChatOpenRouter({
  model: 'openai/gpt-4o-mini',
  seed: generateSeed(),
  temperature: 0.8,
}).withStructuredOutput(
  z.object({
    recipes: z.array(recipeStoreRequestSchema),
  }),
  {
    method: 'jsonSchema',
    strict: true,
  }
)

export const nodeGenerateRecipesByBatch: GraphNode<typeof GraphState> = async (state) => {
  const { recipeNames, context } = state

  const { meal_time: mealTime } = context

  const batches = chunk(recipeNames, RECIPES_PER_BATCH)

  const inputs = batches.map((batchRecipeNames) => {
    const recipeNameList = batchRecipeNames
      .map((recipeName, index) => `${index + 1}. ${recipeName}`)
      .join('\n')

    return [
      {
        role: 'system' as const,
        content: `
          Tu es un chef cuisinier expert.

          Génère une recette complète pour chacun
          des noms fournis.

          Chaque recette doit :
          - correspondre précisément au nom fourni ;
          - être réaliste ;
          - avoir des ingrédients cohérents ;
          - avoir des quantités cohérentes ;
          - avoir des étapes complètes ;
          - respecter strictement le schema fourni.

          Respecte l'ordre des noms fournis.
          Le nom de chaque recette doit correspondre
          au nom demandé.

          Contraintes de format :
          - image doit toujours être null ;
          - image_data_url doit toujours être null ;
          ${
            mealTime
              ? `- meal_times.name doit valoir ${mealTime} ;`
              : '- meal_times.name doit valoir breakfast, lunch, diner ou snack ;'
          }
          - les unités doivent utiliser les valeurs
            autorisées par le schema ;
          - les champs de temps sont exprimés
            en minutes.
        `,
      },
      {
        role: 'user' as const,
        content: `
          Génère exactement ${batchRecipeNames.length}
          recettes correspondant aux noms suivants :

          ${recipeNameList}
        `,
      },
    ]
  })

  const responses = await model.batch(inputs, {
    maxConcurrency: MAX_CONCURRENT_RECIPE_GENERATIONS,
  })

  return {
    ...state,
    recipes: responses.flatMap((response) => response.recipes),
  }
}
