import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateTime } from 'luxon';
import { MealPlanProvider } from '../contexts/meal-plan-context';
import { DayPlannedMeals } from '../stores/week-meal-planner';
import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '../types';
import MealPlanSlots from './meal-plan-slots';

// Données inline simples
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

const meta: Meta<typeof MealPlanSlots> = {
  title: 'Meal Planner/MealPlanSlots',
  component: MealPlanSlots,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Container des créneaux de repas pour une journée, affichant la liste des repas planifiés et le slot vide pour ajouter de nouveaux repas.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <MealPlanProvider data={contextData}>
          <Story />
        </MealPlanProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MealPlanSlots>;

// Helper pour créer un DayPlannedMeals
const createDayPlannedMeals = (
  dateStr: string,
  scenario: 'empty' | 'single' | 'multiple' = 'empty',
): DayPlannedMeals => {
  const date = DateTime.fromISO(dateStr);
  let plannedMeals: PlannedMeal[] = [];

  switch (scenario) {
    case 'single':
      plannedMeals = [
        {
          id: 1,
          planned_date: dateStr,
          meal_time_id: 2,
          recipe: { id: 1, name: 'Salade César' },
        },
      ];
      break;
    case 'multiple':
      plannedMeals = [
        {
          id: 1,
          planned_date: dateStr,
          meal_time_id: 1,
          recipe: { id: 1, name: 'Smoothie Bowl' },
        },
        {
          id: 2,
          planned_date: dateStr,
          meal_time_id: 2,
          recipe: { id: 2, name: 'Salade César' },
        },
        {
          id: 3,
          planned_date: dateStr,
          meal_time_id: 2,
          recipe: { id: 3, name: 'Sandwich Club' },
        },
        {
          id: 4,
          planned_date: dateStr,
          meal_time_id: 3,
          recipe: { id: 4, name: 'Pâtes Carbonara' },
        },
      ];
      break;
    // 'empty' case: plannedMeals reste []
  }

  const plannedMealsSlots = mealTimes.map((mealTime) => {
    return {
      mealTime,
      plannedMeals: plannedMeals.filter(
        (meal) => meal.meal_time_id === mealTime.id,
      ),
    };
  });

  return {
    date,
    plannedMealsSlots,
  };
};

export const Default: Story = {
  args: {
    dayPlannedMeals: createDayPlannedMeals('2024-01-15'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Slots avec un seul repas planifié.',
      },
    },
  },
};

export const Single: Story = {
  args: {
    dayPlannedMeals: createDayPlannedMeals('2024-01-15', 'single'),
  },
  parameters: {
    docs: {
      description: {
        story: "Slots complètement vides, ne montrant que le slot d'ajout.",
      },
    },
  },
};

export const Multiple: Story = {
  args: {
    dayPlannedMeals: createDayPlannedMeals('2024-01-15', 'multiple'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Slots avec plusieurs repas répartis sur différents créneaux.',
      },
    },
  },
};
