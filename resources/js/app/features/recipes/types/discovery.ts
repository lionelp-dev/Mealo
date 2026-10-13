export type DiscoveredRecipe = {
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<{ id: number; slug: string }>;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    category_id: number;
  }>;
  steps: Array<{ order: number; description: string }>;
  tags: Array<{ name: string }>;
  image_data_url: string | null;
  image_generation_failed: boolean;
};

export type DiscoveryPool = {
  recipes: DiscoveredRecipe[];
  failedRecipeCount: number;
};
