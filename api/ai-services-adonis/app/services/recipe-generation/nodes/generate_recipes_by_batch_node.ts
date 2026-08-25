import type { GraphNode } from '@langchain/langgraph'
import { ChatOpenRouter } from '@langchain/openrouter'
import z from 'zod'

import { createRecipeStoreRequestSchema } from '../../../data/request/recipe/schemas/recipe_store.request.schema.ts'
import type { GraphState } from '../recipe_generation_state.ts'
import { chunk } from '../utils/chunk.ts'
import { generateSeed } from '../utils/generate_seed.ts'

const RECIPES_PER_BATCH = 5
const MAX_CONCURRENT_RECIPE_GENERATIONS = 5

export const nodeGenerateRecipesByBatch: GraphNode<typeof GraphState> = async (state) => {
  const {
    recipeNames,
    context,
    ingredient_categories: ingredientCategories,
    meal_times: mealTimes,
  } = state
  const ingredientCategoryCatalog = ingredientCategories
    .map((category) => `${category.id}: ${category.name} (${category.slug})`)
    .join('\n')
  const mealTimeCatalog = mealTimes.map((mealTime) => mealTime.slug).join(', ')
  const mealTimeIdBySlug = new Map(mealTimes.map((mealTime) => [mealTime.slug, mealTime.id]))

  const model = new ChatOpenRouter({
    model: 'openai/gpt-4o-mini',
    seed: generateSeed(),
    temperature: 0.8,
  }).withStructuredOutput(
    z.object({
      recipes: z.array(
        createRecipeStoreRequestSchema({
          ingredient_categories: ingredientCategories,
          meal_times: mealTimes,
        })
      ),
    }),
    {
      method: 'jsonSchema',
      strict: true,
    }
  )

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
          - ingredients[].category_id doit toujours être l'ID exact du catalogue de catégories d'ingrédients ;
          - les slugs et les noms des catégories d'ingrédients ne servent que de contexte métier, jamais de sortie ;
          - catalogue des catégories d'ingrédients :
            ${ingredientCategoryCatalog || 'aucune catégorie disponible'}
          - meal_times[].slug est la seule sortie attendue pour les moments de repas (aucun id, aucun nom) ;
          - catalogue des slugs de moments de repas autorisés : ${mealTimeCatalog || 'aucun'} ;
          ${
            mealTime
              ? `- meal_times[].slug doit valoir exactement ${mealTime} ;`
              : '- meal_times[].slug doit être un slug exact du catalogue ci-dessus ;'
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

  // L'IA ne renvoie que le slug ; on re-résout l'id depuis le catalogue (source de vérité)
  // pour ne jamais dépendre d'un id inventé par le modèle.
  return {
    ...state,
    recipes: responses.flatMap((response) =>
      response.recipes.map((recipe) => ({
        ...recipe,
        meal_times: recipe.meal_times
          .filter((recipeMealTime) => mealTimeIdBySlug.has(recipeMealTime.slug))
          .map((recipeMealTime) => ({
            id: mealTimeIdBySlug.get(recipeMealTime.slug)!,
            slug: recipeMealTime.slug,
          })),
      }))
    ),
  }
}
