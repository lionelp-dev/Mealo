import { END, START, StateGraph } from '@langchain/langgraph'
import { RecipeContentDiscoveryContextSchema } from '../contexts/recipe_content_discovery_context.ts'
import { generateImage } from '../node/content/generate_image.ts'
import { generateRecipe } from '../node/content/generate_recipe.ts'
import { RecipeContentDiscoveryState } from '../state/recipe_content_discovery_state.ts'

export const recipeContentDiscoveryGraph = new StateGraph({
  state: RecipeContentDiscoveryState,
  context: RecipeContentDiscoveryContextSchema,
})
  .addNode('generate_recipe', generateRecipe)
  .addNode('generate_image', generateImage)
  .addEdge(START, 'generate_recipe')
  .addEdge('generate_recipe', 'generate_image')
  .addEdge('generate_image', END)
  .compile()
