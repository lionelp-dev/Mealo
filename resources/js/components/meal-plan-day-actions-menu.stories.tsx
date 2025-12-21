import type { Meta, StoryObj } from '@storybook/react-vite';
import { MealPlanProvider } from '../contexts/meal-plan-context';
import { CopiedDayPlannedMeals } from '../stores/week-meal-planner';
import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '../types';
import MealPlanDayActionsMenu from './meal-plan-day-actions-menu';

const mealTimes: MealTime[] = [
  { id: 1, name: 'breakfast' },
  { id: 2, name: 'lunch' },
  { id: 3, name: 'diner' },
];

const recipes: PaginatedCollection<Recipe> = {
  data: [],
  links: { first: '', last: '', prev: '', next: '' },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 20,
    to: 0,
    total: 0,
    has_more_pages: false,
  },
};

const contextData = {
  weekStart: '2024-01-15',
  mealTimes,
  plannedMeals: [] as PlannedMeal[],
  recipes,
  tags: [] as Tag[],
};

const mockCopiedMeals: CopiedDayPlannedMeals = {
  planned_meals: [
    { recipe_id: 1, meal_time_id: 1, planned_date: '2024-01-14' },
    { recipe_id: 2, meal_time_id: 2, planned_date: '2024-01-14' },
  ],
};

const meta: Meta<typeof MealPlanDayActionsMenu> = {
  title: 'Meal Planner/MealPlanDayActionsMenu',
  component: MealPlanDayActionsMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Menu d'actions contextuelles pour une journée : copier, coller et supprimer tous les repas planifiés.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 p-4">
        <MealPlanProvider data={contextData}>
          <Story />
        </MealPlanProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MealPlanDayActionsMenu>;

export const Default: Story = {
  args: {
    hasPlannedMeals: true,
    copiedDayPlannedMeals: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Menu avec repas planifiés, permettant uniquement de copier et supprimer.',
      },
    },
  },
};

export const WithCopiedMeals: Story = {
  args: {
    hasPlannedMeals: true,
    copiedDayPlannedMeals: mockCopiedMeals,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Menu complet avec toutes les actions disponibles : copier, coller et supprimer.',
      },
    },
  },
};

export const EmptyDayWithCopied: Story = {
  args: {
    hasPlannedMeals: false,
    copiedDayPlannedMeals: mockCopiedMeals,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Menu pour un jour vide mais avec des repas copiés disponibles, permettant uniquement de coller.',
      },
    },
  },
};
