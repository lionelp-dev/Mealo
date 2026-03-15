export type PlannedMealIngredient = {
  shopping_list_id: number;
  ingredient_id: number;
  name: string;
  total_quantity: number;
  unit: string;
  is_checked: boolean;
  from_planned_meals: {
    planned_meal_id: number;
    recipe_id: number;
    recipe_name: string;
    ingredient_quantity: number;
    ingredient_unit: number;
    is_checked: boolean;
  }[];
  from_recipes: {
    recipe_id: number;
    recipe_name: string;
    ingredient_quantity: number;
    ingredient_unit: number;
  }[];
};

export type PlannedMealRecipeIngredient = {
  shopping_list_id: number;
  ingredient_id: number;
  name: string;
  total_quantity: number;
  unit: string;
  is_checked: boolean;
  from_planned_meals: {
    planned_meal_id: number;
    quantity: number;
    is_checked: boolean;
  }[];
};

export type ShoppingList = {
  id: number;
  user_id: number;
  workspace_id: number;
  week_start: string;
  created_at: string;
  updated_at: string;
  by_ingredients: {
    checked: PlannedMealIngredient[];
    unchecked: PlannedMealIngredient[];
  };
  by_recipes: {
    recipe_id: number;
    recipe_name: string;
    ingredients: {
      checked: PlannedMealRecipeIngredient[];
      unchecked: PlannedMealRecipeIngredient[];
    };
  }[];
};
