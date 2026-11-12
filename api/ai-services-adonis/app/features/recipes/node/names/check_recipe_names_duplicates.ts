import type { GraphNode } from '@langchain/langgraph'
import type { RecipeNameGenerationContext } from '../../contexts/recipe_name_generation_context.ts'
import { type RecipeNameGenerationState } from '../../state/recipe_name_generation_state.ts'
import { normalizeRecipeName } from '../../utils/normalize_recipe_name.ts'

export const checkRecipeNamesDuplicates: GraphNode<
  typeof RecipeNameGenerationState,
  RecipeNameGenerationContext
> = async (state, runtime) => {
  if (state.generatedRecipeNameResults.length === 0) {
    throw new Error('Aucun nom de recette généré à vérifier.')
  }

  const existingNames = await runtime.context!.recipeRepository.findExistingRecipeNames(
    runtime.context!.ownerId,
    state.generatedRecipeNameResults.map((recipeNameResult) => recipeNameResult.name)
  )
  const existingNameSet = new Set(existingNames.map(normalizeRecipeName))
  const acceptedNameSet = new Set(
    state.acceptedRecipeNameResults.map((recipeNameResult) => normalizeRecipeName(recipeNameResult.name))
  )
  const acceptedRecipeNameResults = [...state.acceptedRecipeNameResults]
  const pendingRecipeNameRequests = [] as typeof state.pendingRecipeNameRequests
  const rejectedRecipeNames: string[] = []

  for (const recipeNameResult of state.generatedRecipeNameResults) {
    const normalizedName = normalizeRecipeName(recipeNameResult.name)

    if (existingNameSet.has(normalizedName) || acceptedNameSet.has(normalizedName)) {
      pendingRecipeNameRequests.push({
        prompt: recipeNameResult.prompt,
        requiredMealTimeSlug: recipeNameResult.requiredMealTimeSlug,
      })
      rejectedRecipeNames.push(recipeNameResult.name)
      continue
    }

    acceptedNameSet.add(normalizedName)
    acceptedRecipeNameResults.push(recipeNameResult)
  }

  return {
    acceptedRecipeNameResults,
    pendingRecipeNameRequests,
    generatedRecipeNameResults: [],
    excludedRecipeNames: [
      ...new Set([
        ...state.excludedRecipeNames,
        ...acceptedRecipeNameResults.map((recipeNameResult) => recipeNameResult.name),
        ...rejectedRecipeNames,
      ]),
    ],
  }
}
