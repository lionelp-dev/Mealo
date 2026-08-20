import { END, START, StateGraph } from '@langchain/langgraph'

import { nodeGenerateRecipeImagesByBatch } from './nodes/generate_recipe_images_by_batch_node.ts'
import { nodeGenerateRecipesByBatch } from './nodes/generate_recipes_by_batch_node.ts'
import { nodeGenerateRecipesNameList } from './nodes/generate_recipe_names_node.ts'

import { GraphState } from './recipe_generation_state.ts'

export const recipeGenerationGraph = new StateGraph(GraphState)
  .addNode('node_generate_recipes_name_list', nodeGenerateRecipesNameList)
  .addNode('node_generate_recipes_by_batch', nodeGenerateRecipesByBatch)
  .addNode('node_generate_recipe_images_by_batch', nodeGenerateRecipeImagesByBatch)
  .addEdge(START, 'node_generate_recipes_name_list')
  .addEdge('node_generate_recipes_name_list', 'node_generate_recipes_by_batch')
  .addConditionalEdges('node_generate_recipes_by_batch', (state) =>
    state.context.generate_images ? 'node_generate_recipe_images_by_batch' : END
  )
  .addEdge('node_generate_recipe_images_by_batch', END)
  .compile()
