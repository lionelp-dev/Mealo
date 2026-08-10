export type IngredientRequestData = {
  name: string;
  quantity: number;
  unit: string;
  id?: string;
};
export type IngredientResourceData = {
  id: string;
  name: string;
};
export type MealTimeEnum = 'breakfast' | 'lunch' | 'diner' | 'snack';
export type MealTimeRequestData = {
  name: string;
};
export type MealTimeResourceData = {
  id: number;
  name: string;
};
export type PlannedMealDestroyRequestData = {
  planned_meals: Array<number>;
};
export type PlannedMealGeneratePlanRequestData = {
  startDate: string;
  endDate: string;
  serving_size: number;
};
export type PlannedMealIndexRequestData = {
  week?: string;
};
export type PlannedMealRecipeResourceData = {
  id: string;
  name: string;
  image_url: string | null;
};
export type PlannedMealRequestData = {
  recipe_id: string;
  meal_time_id: number;
  planned_date: string;
  serving_size: number;
};
export type PlannedMealResourceData = {
  id: number;
  planned_date: string;
  meal_time_id: number;
  meal_time_name?: string;
  serving_size: number;
  recipe: PlannedMealRecipeResourceData | null;
};
export type PlannedMealStoreRequestData = {
  planned_meals: Array<PlannedMealRequestData>;
};
export type PlannedMealUpdateRequestData = {
  recipe_id: string;
  meal_time_id: number;
  planned_date: string;
  serving_size?: number;
};
export type RecipeAIGenerationRequestData = {
  prompt: string;
  image_generation?: boolean;
};
export type RecipeAIPromptResourceData = {
  id: string;
  name: string;
  serving_size: number;
  meal_times: Array<MealTimeResourceData>;
  tags: Array<TagResourceData>;
};
export type RecipeDestroyRequestData = {
  ids: Array<string>;
};
export type RecipeEditRequestData = {
  show_recipe_ai_generation_modal?: boolean;
};
export type RecipeFiltersRequestData = {
  tags?: Array<number> | null;
  meal_times?: Array<number> | null;
  preparation_time?: string;
  cooking_time?: string;
};
export type RecipeImageAIGenerationRequestData = {
  name: string;
  ingredients?: Array<IngredientRequestData> | null;
};
export type RecipeIngredientResourceData = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};
export type RecipeResourceData = {
  id: string;
  user_id: number;
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeResourceData>;
  ingredients: Array<RecipeIngredientResourceData> | undefined;
  steps: Array<StepResourceData>;
  tags: Array<TagResourceData>;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};
export type RecipeSearchRequestData = {
  search?: string;
  ingredients_search?: string;
  tags_search?: string;
};
export type RecipeStoreRequestData = {
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeRequestData>;
  ingredients: Array<IngredientRequestData>;
  steps: Array<StepRequestData>;
  tags: Array<TagRequestData>;
  image: File | null;
};
export type RecipeUpdateRequestData = {
  id: string;
  name: string;
  description: string;
  serving_size: number;
  preparation_time: number;
  cooking_time: number;
  meal_times: Array<MealTimeRequestData>;
  ingredients: Array<IngredientRequestData>;
  steps: Array<StepRequestData>;
  tags: Array<TagRequestData>;
  image: File | null;
  remove_image: boolean;
};
export type ShoppingListIndexRequestData = {
  week?: string;
};
export type ShoppingListPlannedMealIngredientRequestData = {
  shopping_list_id: number;
  planned_meal_id: number;
  ingredient_id: string;
  is_checked: boolean;
};
export type ShoppingListResourceData = {
  id: number;
  user_id: number;
  workspace_id: number;
  week_start: string;
  by_ingredients: {
    checked: PlannedMealIngredient[];
    unchecked: PlannedMealIngredient[];
  };
  by_recipes: Array<{
    recipe_id: number;
    recipe_name: string;
    ingredients: {
      checked: PlannedMealRecipeIngredient[];
      unchecked: PlannedMealRecipeIngredient[];
    };
  }>;
  created_at: string | null;
  updated_at: string | null;
};
export type ShoppingListToggleIngredientRequestData = {
  is_checked: boolean;
};
export type ShoppingListUpdateRequestData = {
  shopping_list_planned_meal_ingredients: Array<ShoppingListPlannedMealIngredientRequestData>;
};
export type StepRequestData = {
  order: number;
  description: string;
};
export type StepResourceData = {
  id: string;
  order: number;
  description: string;
};
export type TagRequestData = {
  name: string;
};
export type TagResourceData = {
  id: string;
  name: string;
};
export type Unit = {
  name: string;
  value: string;
};
export type WorkspaceInvitationAcceptRequestData = {
  token: string;
};
export type WorkspaceInvitationDeclineRequestData = {
  token: string;
};
export type WorkspaceInvitationDeleteRequestData = {
  invitation: number;
};
export type WorkspaceInvitationResourceData = {
  id: number;
  workspace_id: number;
  workspace_name: string | null;
  workspace_users_count: number | null;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  invited_by: { name: string };
};
export type WorkspaceInvitationStoreRequestData = {
  workspace_id: number;
  email: string;
  role: 'editor' | 'viewer';
};
export type WorkspaceMemberDeleteRequestData = {
  user_id: number;
};
export type WorkspaceMemberResourceData = {
  id: number;
  name: string;
  email: string;
  role: string | null;
  joined_at: string;
};
export type WorkspaceMemberRoleUpdateRequestData = {
  user_id: number;
  role: 'editor' | 'viewer';
};
export type WorkspaceResourceData = {
  id: number;
  owner_id: number;
  name: string;
  is_default: boolean;
  is_personal: boolean;
  users_count: number;
  created_at: string;
  updated_at: string;
  members: Array<WorkspaceMemberResourceData>;
  pending_invitations: Array<WorkspaceInvitationResourceData>;
};
export type WorkspaceStoreRequestData = {
  name: string;
  is_personal: boolean;
};
export type WorkspaceUpdateRequestData = {
  name: string | null;
  is_personal: boolean | null;
};
