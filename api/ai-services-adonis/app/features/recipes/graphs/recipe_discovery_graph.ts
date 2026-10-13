import { END, START, StateGraph } from '@langchain/langgraph'
import { MAX_RECIPE_GENERATION_ATTEMPTS } from '../constants.ts'
import { RecipeDiscoveryContextSchema } from '../contexts/recipe_discovery_context.ts'
import { checkRecipeDuplicate } from '../node/candidate/check_recipe_duplicate.ts'
import { generateRecipe } from '../node/candidate/generate_recipe.ts'
import { generateRecipeName } from '../node/candidate/generate_recipe_name.ts'
import { generateImage } from '../node/generate_image.ts'
import { RecipeDiscoveryState } from '../state/recipe_discovery_state.ts'

export const recipeDiscoveryGraph = new StateGraph({
  state: RecipeDiscoveryState,
  context: RecipeDiscoveryContextSchema,
})
  .addNode('generate_recipe_name', generateRecipeName)
  .addNode('check_recipe_duplicate', checkRecipeDuplicate)
  .addNode('generate_recipe', generateRecipe)
  .addNode('generate_image', generateImage)
  .addEdge(START, 'generate_recipe_name')
  .addEdge('generate_recipe_name', 'check_recipe_duplicate')
  .addConditionalEdges(
    'check_recipe_duplicate',
    (state) =>
      !state.isDuplicateRecipe
        ? 'generate_recipe'
        : state.generationAttempts < MAX_RECIPE_GENERATION_ATTEMPTS
          ? 'generate_recipe_name'
          : END,
    ['generate_recipe_name', 'generate_recipe', END]
  )
  .addEdge('generate_recipe', 'generate_image')
  .addEdge('generate_image', END)
  .compile()
