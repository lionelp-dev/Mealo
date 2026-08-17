import { END, START, StateGraph } from '@langchain/langgraph'

import { nodeGenerateRecipesByBatch } from './nodes/generate_recipes_by_batch_node.ts'
import { nodeGenerateRecipesNameList } from './nodes/generate_recipe_names_node.ts'
import { GraphState } from './recipe_generation_state.ts'

export const recipeGenerationGraph = new StateGraph(GraphState)
  .addNode('node_generate_recipes_name_list', nodeGenerateRecipesNameList)
  .addNode('node_generate_recipes_by_batch', nodeGenerateRecipesByBatch)
  .addEdge(START, 'node_generate_recipes_name_list')
  .addEdge('node_generate_recipes_name_list', 'node_generate_recipes_by_batch')
  .addEdge('node_generate_recipes_by_batch', END)
  .compile()
