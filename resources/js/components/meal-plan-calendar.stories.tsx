import type { Meta, StoryObj } from '@storybook/react-vite';
import { MealPlanProvider } from '../contexts/meal-plan-context';
import {
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '../types';
import MealPlanCalendar from './meal-plan-calendar';

// Données inline simples
const mealTimes: MealTime[] = [
  { id: 1, name: 'breakfast' },
  { id: 2, name: 'lunch' },
  { id: 3, name: 'diner' },
];

const sampleRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Salade César',
    description: 'Salade fraîche',
    preparation_time: 15,
    cooking_time: 5,
    meal_times: [mealTimes[1]],
    ingredients: [],
    steps: [],
    tags: [],
  },
  {
    id: 2,
    name: 'Pâtes Carbonara',
    description: 'Pâtes crémeuses',
    preparation_time: 10,
    cooking_time: 20,
    meal_times: [mealTimes[2]],
    ingredients: [],
    steps: [],
    tags: [],
  },
  {
    id: 3,
    name: 'Smoothie Bowl',
    description: 'Smoothie aux fruits',
    preparation_time: 10,
    cooking_time: 0,
    meal_times: [mealTimes[0]],
    ingredients: [],
    steps: [],
    tags: [],
  },
];

const recipes: PaginatedCollection<Recipe> = {
  data: sampleRecipes,
  links: { first: '', last: '', prev: '', next: '' },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 20,
    to: sampleRecipes.length,
    total: sampleRecipes.length,
    has_more_pages: false,
  },
};

const createContextData = (scenario: 'empty' | 'partial' | 'full') => {
  let plannedMeals: PlannedMeal[] = [];

  if (scenario === 'partial') {
    plannedMeals = [
      {
        id: 1,
        planned_date: '2024-01-15',
        meal_time_id: 1,
        recipe: { id: 3, name: 'Smoothie Bowl' },
      },
      {
        id: 2,
        planned_date: '2024-01-15',
        meal_time_id: 2,
        recipe: { id: 1, name: 'Salade César' },
      },
      {
        id: 3,
        planned_date: '2024-01-16',
        meal_time_id: 3,
        recipe: { id: 2, name: 'Pâtes Carbonara' },
      },
      {
        id: 4,
        planned_date: '2024-01-17',
        meal_time_id: 2,
        recipe: { id: 1, name: 'Salade César' },
      },
      {
        id: 5,
        planned_date: '2024-01-19',
        meal_time_id: 1,
        recipe: { id: 3, name: 'Smoothie Bowl' },
      },
    ];
  } else if (scenario === 'full') {
    // Générer des repas pour tous les jours de la semaine
    const days = [
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
      '2024-01-18',
      '2024-01-19',
      '2024-01-20',
      '2024-01-21',
    ];
    plannedMeals = days.flatMap((date, dayIndex) =>
      mealTimes.map((mealTime, mealIndex) => ({
        id: dayIndex * 3 + mealIndex + 1,
        planned_date: date,
        meal_time_id: mealTime.id,
        recipe: {
          id: ((dayIndex * 3 + mealIndex) % sampleRecipes.length) + 1,
          name: sampleRecipes[(dayIndex * 3 + mealIndex) % sampleRecipes.length]
            .name,
        },
      })),
    );
  }

  return {
    weekStart: '2024-01-15',
    mealTimes,
    plannedMeals,
    recipes,
    tags: [] as Tag[],
  };
};

const meta: Meta<typeof MealPlanCalendar> = {
  title: 'Meal Planner/MealPlanCalendar',
  component: MealPlanCalendar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Calendrier principal du planificateur de repas qui affiche une semaine complète avec les repas planifiés pour chaque jour et créneau horaire.',
      },
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div className="p-4">
        <MealPlanProvider data={parameters.contextData}>
          <Story />
        </MealPlanProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MealPlanCalendar>;

export const Default: Story = {
  parameters: {
    contextData: createContextData('partial'),
    docs: {
      description: {
        story:
          'Calendrier avec quelques repas planifiés dans la semaine, montrant un mélange de jours vides et remplis.',
      },
    },
  },
};

export const EmptyWeek: Story = {
  parameters: {
    contextData: createContextData('empty'),
    docs: {
      description: {
        story:
          'Calendrier complètement vide, idéal pour débuter une nouvelle planification.',
      },
    },
  },
};

export const FullWeek: Story = {
  parameters: {
    contextData: createContextData('full'),
    docs: {
      description: {
        story:
          'Calendrier avec tous les créneaux remplis, montrant une semaine complètement planifiée.',
      },
    },
  },
};
