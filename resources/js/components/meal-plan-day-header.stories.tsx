import { MealPlanDataProvider } from '../contexts/meal-plan-context';
import {
  DayPlannedMeals,
  MealTime,
  PaginatedCollection,
  PlannedMeal,
  Recipe,
  Tag,
} from '../types';
import MealPlanDayHeader from './meal-plan-day-header';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DateTime } from 'luxon';

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
  workspace_data: {
    current_workspace: {
      id: 1,
      name: 'Test',
      owner_id: 1,
      is_personal: true,
      is_default: true,
      members: [],
      pending_invitations: [],
      created_at: '2024-01-01T00:00:00.000000Z',
      updated_at: '2024-01-01T00:00:00.000000Z',
    },
    workspaces: [],
  },
};

const meta: Meta<typeof MealPlanDayHeader> = {
  title: 'Meal Planner/MealPlanDayHeader',
  component: MealPlanDayHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "En-tête d'une journée dans le calendrier de planification des repas, avec date, indicateur du jour actuel et menu d'actions.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <MealPlanDataProvider data={contextData}>
          <Story />
        </MealPlanDataProvider>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MealPlanDayHeader>;

const createDayPlannedMeals = (
  dateStr: string,
  mealsCount: 'empty' | 'partial' | 'full' = 'partial',
  isToday = false,
): DayPlannedMeals => {
  const date = isToday ? DateTime.now() : DateTime.fromISO(dateStr);

  let plannedMeals: PlannedMeal[] = [];

  if (mealsCount === 'partial') {
    plannedMeals = [
      {
        id: 1,
        planned_date: dateStr,
        meal_time_id: 1,
        serving_size: 1,
        recipe: { id: 1, name: 'Smoothie Bowl' },
      },
      {
        id: 2,
        planned_date: dateStr,
        meal_time_id: 3,
        serving_size: 4,
        recipe: { id: 2, name: 'Pâtes Carbonara' },
      },
    ];
  } else if (mealsCount === 'full') {
    plannedMeals = mealTimes.map((mealTime, index) => ({
      id: index + 1,
      planned_date: dateStr,
      meal_time_id: mealTime.id,
      serving_size: 2,
      recipe: { id: index + 1, name: `Recette ${mealTime.name}` },
    }));
  }

  const plannedMealsSlots = mealTimes.map((mealTime) => ({
    mealTime,
    plannedMeals: plannedMeals.filter(
      (meal) => meal.meal_time_id === mealTime.id,
    ),
  }));

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
        story: "En-tête d'une journée normale avec quelques repas planifiés.",
      },
    },
  },
};

export const CurrentDay: Story = {
  args: {
    dayPlannedMeals: createDayPlannedMeals(
      DateTime.now().toISODate(),
      'partial',
      true,
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'En-tête du jour actuel, mis en évidence avec une couleur différente.',
      },
    },
  },
};
