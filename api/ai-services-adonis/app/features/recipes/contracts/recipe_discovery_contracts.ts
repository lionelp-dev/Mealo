export type DiscoveryCatalog = {
  ingredient_categories: Array<{ id: number; slug: string; name: string }>
  meal_times: Array<{ id: number; slug: string }>
}

export type RecipeNameGenerationRequest = {
  prompt: string
  requiredMealTimeSlug: string | null
}

export type GeneratedRecipeNameResult = RecipeNameGenerationRequest & {
  name: string
}

export type GeneratedDiscoveryRecipe = {
  name: string
  description: string
  serving_size: number
  preparation_time: number
  cooking_time: number
  meal_times: Array<{ id: number; slug: string }>
  ingredients: Array<{ name: string; quantity: number; unit: string; category_id: number }>
  steps: Array<{ order: number; description: string }>
  tags: Array<{ name: string }>
  image_data_url: string | null
}

export interface RecipeGenerator {
  generateNames(requests: RecipeNameGenerationRequest[], excludedNames: string[]): Promise<string[]>
  generateRecipe(
    prompt: string,
    name: string,
    catalog: DiscoveryCatalog
  ): Promise<GeneratedDiscoveryRecipe>
}

export interface RecipeImageGenerator {
  generateDataUrl(name: string): Promise<string | null>
}

export interface RecipeRepository {
  findExistingRecipeNames(ownerId: number, names: string[]): Promise<string[]>
}
