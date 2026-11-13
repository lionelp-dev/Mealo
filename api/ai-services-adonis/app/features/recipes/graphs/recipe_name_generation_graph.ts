import { END, START, StateGraph } from '@langchain/langgraph'
import { DISCOVERY_POOL_SIZE } from '../constants.ts'
import { RecipeNameGenerationContextSchema } from '../contexts/recipe_name_generation_context.ts'
import { checkRecipeNamesDuplicates } from '../node/names/check_recipe_names_duplicates.ts'
import { generateRecipeNames } from '../node/names/generate_recipe_names.ts'
import { RecipeNameGenerationState } from '../state/recipe_name_generation_state.ts'

export const recipeNameGenerationGraph = new StateGraph({
  state: RecipeNameGenerationState,
  context: RecipeNameGenerationContextSchema,
})
  .addNode('generate_recipe_names', generateRecipeNames)
  .addNode('check_recipe_names_duplicates', checkRecipeNamesDuplicates)
  .addEdge(START, 'generate_recipe_names')
  .addEdge('generate_recipe_names', 'check_recipe_names_duplicates')
  .addConditionalEdges(
    'check_recipe_names_duplicates',
    (state) =>
      state.acceptedRecipeNameResults.length === DISCOVERY_POOL_SIZE
        ? END
        : 'generate_recipe_names',
    ['generate_recipe_names', END]
  )
  .compile()
