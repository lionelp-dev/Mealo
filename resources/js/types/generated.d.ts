export type AcceptWorkspaceInvitationRequestData = {
  token: string;
};
export type DeclineWorkspaceInvitationRequestData = {
  token: string;
};
export type DeleteWorkspaceInvitationRequestData = {
  invitation: number;
};
export type DeleteWorkspaceMemberRequestData = {
  user_id: number;
};
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
export type RecipeImageGenerationRequestData = {
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
export type StoreWorkspaceInvitationRequestData = {
  workspace_id: number;
  email: string;
  role: 'editor' | 'viewer';
};
export type StoreWorkspaceRequestData = {
  name: string;
  is_personal: boolean;
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
export type UpdateWorkspaceMemberRoleRequestData = {
  user_id: number;
  role: 'editor' | 'viewer';
};
export type UpdateWorkspaceRequestData = {
  name: string | null;
  is_personal: boolean | null;
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
export type WorkspaceMemberResourceData = {
  id: number;
  name: string;
  email: string;
  role: string | null;
  joined_at: string;
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
