import type { GraphNode } from '@langchain/langgraph'
import { ChatOpenRouter } from '@langchain/openrouter'
import z from 'zod'

import type { GraphState } from '../recipe_generation_state.ts'
import { generateSeed } from '../utils/generate_seed.ts'

export const nodeGenerateRecipesNameList: GraphNode<typeof GraphState> = async (state) => {
  const recipeCount = state.context.count ?? 1

  const model = new ChatOpenRouter({
    model: 'openai/gpt-4o-mini',
    seed: generateSeed(),
    temperature: 0.8,
  }).withStructuredOutput(
    z.object({
      recipeNames: z.array(z.string().min(1)).length(recipeCount),
    }),
    {
      method: 'jsonSchema',
      strict: true,
    }
  )

  const response = await model.invoke([
    {
      role: 'system',
      content: `
        Tu es un chef cuisinier expert.

        Ta tâche est de faire une liste de noms de recettes.

        Toutes les recettes doivent être différentes.

        Ne propose pas deux variantes quasiment identiques du même plat.

        Cherche une bonne diversité dans :
        - les plats ;
        - les ingrédients ;
        - les cuisines ;
        - les méthodes de préparation.
      `,
    },
    {
      role: 'user',
      content: `
        Demande utilisateur :

        ${state.message.content}

        Moment du repas : ${state.context.meal_time ?? 'non précisé'}.

        Génère exactement ${recipeCount} noms de recettes distinctes adaptées à ce moment du repas.
      `,
    },
  ])

  return {
    recipeNames: response.recipeNames,
  }
}
