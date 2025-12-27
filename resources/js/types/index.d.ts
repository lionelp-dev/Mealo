import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export type Auth = {
  user: User;
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

export type SharedData = {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  [key: string]: unknown;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

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
    has_more_pages;
  };
};

export type FlashMessage = {
  message?: string;
  success?: string;
  error?: string;
  warning?: string;
};

export type MealTime = {
  id: number;
  name: string;
};

export type Ingredient = {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
};

export type Step = {
  id?: number;
  order: number;
  description: string;
};

export type Tag = {
  id?: number;
  name: string;
};

export type Recipe = {
  id: number;
  name: string;
  description: string;
  preparation_time: number;
  cooking_time: number;
  meal_times: MealTime[];
  ingredients: Ingredient[];
  steps: Step[];
  tags: Tag[];
  image_url?: string | null;
  image?: File | null;
};

export type PlannedMeal = {
  id: number;
  planned_date: string;
  meal_time_id: number;
  recipe: Pick<Recipe, 'id' | 'name' | 'image_url'>;
};

export type ShoppingList = {
  data: {
    id: number;
    user_id: number;
    week_start: string;
    ingredients?: ShoppingListIngredient[];
    created_at: string;
    updated_at: string;
  };
};

export type ShoppingListIngredient = {
  id: number;
  shopping_list_id: number;
  ingredient_id: number;
  ingredient: {
    id: number;
    name: string;
  };
  quantity: number;
  unit: string;
  is_checked: boolean;
  created_at: string;
  updated_at: string;
};
