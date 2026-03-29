import type { InertiaLinkProps } from '@inertiajs/react';
import type {
  CalendarDateProps,
  CalendarMonthProps,
  CalendarMultiProps,
  CalendarRangeProps,
} from 'cally';
import type { LucideIcon } from 'lucide-react';

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar?: string;
  local?: string;
  two_factor_enabled?: boolean;
  is_beta_user?: boolean;
  beta_expires_at?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type Auth = {
  user: User;
};

export type FlashMessage = {
  message?: string;
  success?: string;
  error?: string;
  warning?: string;
};

export type Flash = {
  message: string | null;
  success: string | null;
  error: string | null;
  warning: string | null;
  new_workspace_id: number | null;
};

export type SharedData = {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  flash: Flash;
  [key: string]: unknown;
};

export type PageProps = SharedData;

export type PaginatedCollection<T> = {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string;
      label: string;
      page: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
    has_more_pages: boolean;
  };
};

export type BreadcrumbItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavItem = {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
};

export type Option = { value: string; label: string };

export type Filter = {
  type: 'meal_time' | 'preparation_time' | 'cooking_time' | 'tag';
} & Option;

export type FilterSection = {
  title: string;
  type: Filter['type'];
  options: Option[];
};

export interface Member {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
}

export interface Invitation {
  id: number;
  email: string;
  role: 'editor' | 'viewer';
  expires_at: string;
  invited_by: {
    name: string;
  };
}

export type Workspace = {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  is_personal: boolean;
  is_default: boolean;
  users_count?: number;
  user_role?: 'owner' | 'editor' | 'viewer';
  members: Member[];
  pending_invitations?: Invitation[];
  created_at: string;
  updated_at: string;
};

export type WorkspaceData = {
  current_workspace: Workspace;
  workspaces: Workspace[];
  pending_invitations?: PendingInvitation[];
};

export type WorkspaceUser = {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
};

export type WorkspaceInvitation = {
  id: number;
  workspace_id: number;
  workspace: Workspace;
  email: string;
  role: 'editor' | 'viewer';
  token: string;
  invited_by: Pick<User, 'id' | 'name'>;
  expires_at: string;
  created_at: string;
};

export type PendingInvitation = {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  workspace: Workspace & {
    owner: Pick<User, 'id' | 'name'>;
  };
};

export type PlannedMeal = {
  id: number;
  workspace_id?: number;
  meal_time_id: number;
  planned_date: string;
  recipe: Pick<Recipe, 'id' | 'name' | 'image_url'>;
  serving_size: number;
};

export type PlannedMealsSlot = {
  mealTime: MealTime;
  plannedMeals: PlannedMeal[];
};

export type DayPlannedMeals = {
  date: DateTime;
  plannedMealsSlots: PlannedMealsSlot[];
};

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

export type BetaRequest = {
  id: number;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted' | 'expired';
  created_at: string;
  approved_at: string | null;
  token_expires_at: string | null;
  rejection_reason: string | null;
  approved_by: { id: number; name: string } | null;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type MapEvents<T> = {
  [K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K];
};

declare module 'react' {
   
  namespace JSX {
    interface IntrinsicElements {
      'calendar-month': MapEvents<CalendarMonthProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-range': MapEvents<CalendarRangeProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-date': MapEvents<CalendarDateProps> &
        React.HTMLAttributes<HTMLElement>;
      'calendar-multi': MapEvents<CalendarMultiProps> &
        React.HTMLAttributes<HTMLElement>;
    }
  }
}
